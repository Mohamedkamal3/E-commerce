import { Router } from "express";
import {isAuthenticated} from "./../../middleware/authentication.middleware.js"
import {isAuthorized} from "./../../middleware/authorization.middleware.js"
import {validation} from "./../../middleware/validation.middleware.js"
import * as cartController from "./cart.controller.js"
import * as cartSchema from "./cart.schema.js"
const router = Router()

// add product to cart
router.post("/" , isAuthenticated,isAuthorized("user"),validation(cartSchema.addToCartSchema),cartController.addToCart)

//get user's cart
router.get("/" , isAuthenticated,isAuthorized("user","admin"),validation(cartSchema.userCartSchema),cartController.userCart)

//update cart 
router.patch("/" , isAuthenticated,isAuthorized("user"),validation(cartSchema.updateCartSchema),cartController.updateCart)

// remove products from cart 
router.patch("/:productId" , isAuthenticated,isAuthorized("user"),validation(cartSchema.removeFromCartSchema),cartController.removeFromCart)

//clear cart 
router.put("/clear" , isAuthenticated,isAuthorized("user"),cartController.clearCart)


export default router 