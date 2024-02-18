import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { sendEmails } from "../../utils/sendEmail.js";
import createInvoice from "../../utils/pdfInvoice.js";
import { clearCart, updateStock } from "./order.service.js";
import cloudinary from "../../utils/cloud.js";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createOrder = asyncHandler(async (req, res, next) => {
    // get data
    const { payment, coupon, address, phone } = req.body;

    // check for discount coupons
    let checkCoupon;

    if (coupon) {
        checkCoupon = await Coupon.findOne({ name: coupon, expiredAt: { $gt: Date.now() } })
    }

    if (!checkCoupon) return next(new Error("Invalid coupon !"))

    // get products from cart 

    // get user's cart
    const cart = await Cart.findOne({ user: req.user._id })

    const products = cart.products

    if (products.length < 1) return next(new Error("The cart is empty!"))

    // check for products 
    let orderProduct = [];
    let orderPrice = 0;

    for (let i = 0; i < products.length; i++) {

        const product = await Product.findById(products[i].productId)
        if (!product) {
            return next(new Error(`${products[i].productId} product not found !`))
        }

        if (!product.inStock(products[i].quantity)) {
            return next(new Error(`Product is out of stock , only ${product.availableItems} are available`))
        }

        orderProduct.push({
            name: product.name,
            quantity: products[i].quantity,
            itemPrice: product.finalPrice,
            totalPrice: product.finalPrice * products[i].quantity,
            productId: product._id,

        })
        orderPrice += product.finalPrice * products[i].quantity
    }
    //create order in the DB
    const order = await Order.create({
        user: req.user._id,
        address,
        phone,
        payment,
        products: orderProduct,
        price: orderPrice,
        coupon: {
            id: checkCoupon?._id,
            name: checkCoupon?.name,
            discount: checkCoupon?.discount
        }

    })

    //create invoice 
    const user = req.user
    const invoice = {

        shipping: {
            name: user.userName,
            address: order.address,
            country: "Egypt",

        },
        items: order.products,
        subtotal: order.price, // order price before discounts 
        paid: order.finalPrice,
        invoice_nr: order._id
    };

    const pdfPath = path.join(__dirname, `./../../tempInvoices/${order._id}.pdf`)
    createInvoice(invoice, pdfPath);


    // upload invoice to cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload
        (pdfPath, { folder: `${process.env.CLOUD_FOLDER}/order/invoices` })

    // add invoice to DB  "file" url , id        
    order.invoice = { url: secure_url, id: public_id }
    await order.save()

    // send email to the user with his order  Invoice 

    const sent = await sendEmails({
        to: user.email,
        subject: "Order Invoice ",
        attachments: [{ path: secure_url, contentType: "application/pdf" }]
    })

    if (!sent) return next(new Error("Some thing went wrong!"))
    // update stock 
    updateStock(order.products, true);

    //clear cart 
    clearCart(user._id)

    // Stripe gateway for visa payment
    if (payment === "visa") {

        const stripe = new Stripe(process.env.STRIPE_KEY)
        //stripe coupon
        let couponExisted
        if (order.coupon !== undefined) {
            couponExisted = await stripe.coupons.create({
                percent_off: order.coupon.discount,
                duration: "once",
            })

        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url:process.env.SUCCESS_URL,
            cancel_url:process.env.CANCEL_URL,
            line_items: order.products.map((product) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: { name: product.name},
                        unit_amount: product.itemPrice * 100
                    },
                    quantity: product.quantity

                }
            }),
            discounts:couponExisted ? [{coupon:couponExisted.id}] :[]
        })
        return res.json({success: true , results:{url : session.url}})
    }

    // response
    return res.json({ success: true, results: { order } })

})



export const cancelOrder = asyncHandler(async (req, res, next) => {
    // check for order existance
    const order = await Order.findById(req.params.id)

    if (!order) return next(new Error("Invalid order Id ! ", { cause: 400 }))
    // check the status of the order 
    if (!order.status === "placed")
        return next(new Error("Sorry can't cancel the Order !!"))

    //cancel order 
    order.status = "canceled"
    await order.save()

    //update stock
    updateStock(order.products, false);

    // respose 
    return res.json({ success: true, message: "Order canceled successfully!" })
})