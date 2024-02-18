import { asyncHandler } from "../../utils/asyncHandler.js";
import {Review} from "./../../../DB/models/review.model.js"
import {Order} from "./../../../DB/models/order.model.js"
import { Product } from "../../../DB/models/product.model.js";



export const addReview =asyncHandler(async(req , res ,next)=>{

    const {productId}= req.params
    const{comment , rating} = req.body

    //check if the reviewer purchased the product and it is delivered

    const order= await Order.findOne({
        user:req.user._id,
        status:"delivered",
        "products.productId":productId
    })
    if(!order) return next (new Error (" Can not Review this Product!",{cause:400}))

    //check past review 
    if (await Review.findOne({user:req.user._id , productId ,orderId : order._id}))
    return next (new Error ("Already reviewed before ! "))

    //Create review 
   const review = await Review.create({
        comment,
        rating,
        createdBy :req.user._id,
        productId:productId,
        orderId:order._id
    })

    // calculate averageRate for product
    let calculateRating =0
    const product = await Product.findById(productId)

    const reviews = await Review.find({productId})

    for (let i = 0 ; i< reviews.length;i++){
        calculateRating += reviews[i].rating
    }
product.averageRate=calculateRating/reviews.length

await product.save()
    // response
return res.json({success: ture , results :{review}})
})

export const updateReview = asyncHandler(async(req , res  ,next)=>{

    const {id , productId}=req.params

    await Review.updateOne({_id:id , productId},{... req.body})
    if(req.bodyrating){
        let calculateRating =0
        const product = await Product.findById(productId)
    
        const reviews = await Review.find({productId})
    
        for (let i = 0 ; i< reviews.length;i++){
            calculateRating += reviews[i].rating
        }
    product.averageRate=calculateRating/reviews.length
    
    await product.save()
    }

    return res.json({success:true , message :"Review updated successfully!"})
})