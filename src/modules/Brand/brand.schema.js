import joi from "joi"
import { objectID } from "../../middleware/validation.middleware.js"

export const addBrandSchema = joi.object({
    name:joi.string().min(2).max(20).required(),
    categories : joi.array().items(joi.string().custom(objectID).required())

}).required()

export const updateBrandSchema = joi.object({
id:joi.string().custom(objectID).required(),
name:joi.string(),

}).required()

export const deletebrandSchema = joi.object({
    id:joi.string().custom(objectID).required()
}).required()