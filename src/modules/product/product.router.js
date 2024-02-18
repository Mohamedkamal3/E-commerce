import { Router } from "express";
import {isAuthenticated} from "./../../middleware/authentication.middleware.js"
import {isAuthorized} from "./../../middleware/authorization.middleware.js"
import {validation} from "./../../middleware/validation.middleware.js"
import {fileUpload} from "./../../utils/fileUpload.js"
import reviewRouter from "./../review/review.router.js"
import * as productController from "./product.controller.js"
import * as productSchema from "./product.schema.js"
const router = Router()

router.use("/:productId/review",reviewRouter)

//create product
router.post("/" , isAuthenticated,isAuthorized("seller"),
fileUpload().fields([{name:"defaultImage",maxCount:1},{name:"subImage" , maxCount :3}]),
validation(productSchema.createProductSchema) ,productController.createProduct )

// delete product
router.delete("/:id" , isAuthenticated,isAuthorized("seller"),
validation(productSchema.deleteProductSchema) ,productController.deleteProduct )

// get products
router.get("/",productController.allProducts)

export default router