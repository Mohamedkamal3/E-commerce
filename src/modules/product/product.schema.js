import joi from "joi"
import { objectID } from "../../middleware/validation.middleware.js"

export const createProductSchema= joi.object({
name:joi.string().min(2).max(20).required(),
description: joi.string().min(10).max(200),
availableItems: joi.number().integer().min(1).required(),
price:joi.number().integer().min(1).required(),
discount:joi.number().min(1).max(100),
category:joi.string().custom(objectID).required(),
subcategory:joi.string().custom(objectID).required(),
brand:joi.string().custom(objectID).required(),
}).required()

export const deleteProductSchema = joi.object({

    id: joi.string().custom(objectID).required()
}).required()