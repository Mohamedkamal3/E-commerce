import joi from "joi"
import { objectID } from "../../middleware/validation.middleware.js"



export const addReviewSchema=joi.object({
    productId:joi.string().custom(objectID).required(),
    comment:joi.string().required(),
    rating:joi.number().min(1).max(5).required()


}).required()

export const updateReviewSchema = joi.object({
    
    id:joi.string().custom(objectID).required(),
    comment:joi.string(),
    rating:joi.number().min(1).max(5),
    productId:joi.string().custom(objectID).required()

}).required()