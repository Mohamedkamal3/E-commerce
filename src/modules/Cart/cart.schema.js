import joi from "joi"
import { objectID } from "../../middleware/validation.middleware.js"

export const addToCartSchema = joi.object({
productId: joi.string().custom(objectID).required(),
quantity:joi.number().integer().min(1).required()


}).required()

export const userCartSchema= joi.object({
    cartId : joi.string().custom(objectID)
})

export const updateCartSchema = joi.object({

    productId: joi.string().custom(objectID).required(),
    quantity:joi.number().integer().min(1).required()

}).required()

export const removeFromCartSchema = joi.object({
    productId: joi.string().custom(objectID).required(),

}).required()