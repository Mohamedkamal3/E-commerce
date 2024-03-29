import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./DB/connection.js"
import morgan from "morgan"
import cors from "cors"
import authRouter from "./src/modules/auth/auth.router.js"
import categoryRouter from "./src/modules/category/category.router.js"
import subcategoryRouter from "./src/modules/Subcategory/Subcategory.router.js"
import brandRouter from "./src/modules/Brand/brand.router.js"
import couponRouter from "./src/modules/coupon/coupon.router.js"
import productRouter from "./src/modules/product/product.router.js"
import cartRouter from "./src/modules/Cart/cart.router.js"
import orderRouter from "./src/modules/order/order.router.js"
import reviewRouter from "./src/modules/review/review.router.js"

dotenv.config()

const app = express()

const port = process.env.PORT

//morgan
app.use(morgan("combined"))

//CORS
app.use(cors()) // to allow access from any where

//parsing middle ware
app.use(express.json())

//DB connection
await connectDB()

//routers
app.use("/auth", authRouter)
app.use("/category", categoryRouter)
app.use("/subcategory", subcategoryRouter)
app.use("/brand", brandRouter)
app.use("/coupon", couponRouter)
app.use("/product", productRouter)
app.use("/cart", cartRouter)
app.use("/order", orderRouter)
app.use("/review", reviewRouter)

//page not found handler
app.all("*", (req, res, next) => {
    return next(new Error("Page Not Found !! ", { cause: 404 }))
})

//global error handler
app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    return res.status(statusCode).json({ success: false, message: error.message, stack: error.stack })

})

app.listen(port, () => console.log(`Server is Up and Running on ${port}`))