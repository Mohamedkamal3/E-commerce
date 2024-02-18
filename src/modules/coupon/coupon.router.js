import { Router } from "express";
import {isAuthenticated} from "./../../middleware/authentication.middleware.js"
import {isAuthorized} from "./../../middleware/authorization.middleware.js"
import {validation} from "./../../middleware/validation.middleware.js"
import * as couponController from "./coupon.controller.js"
import * as couponSchema from "./coupon.schema.js"
const router = Router()

//add coupon
router.post("/" , isAuthenticated,isAuthorized("seller"),
validation(couponSchema.addCouponSchema),couponController.addCoupon)

// update coupon
router.patch("/:code" , isAuthenticated,isAuthorized("seller"),
validation(couponSchema.updateCouponSchema),couponController.updateCoupon)

//delete coupon 
router.delete("/:code" , isAuthenticated,isAuthorized("seller"),
validation(couponSchema.deleteCouponSchema),couponController.deleteCoupon)

// all coupons
router.get("/" , isAuthenticated,isAuthorized("seller","admin"),
couponController.allCoupons)

export default router