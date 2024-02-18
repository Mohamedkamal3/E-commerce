import joi from "joi"
import{objectID} from "./../../middleware/validation.middleware.js"

export const createCategorySchema = joi.object({
    name:joi.string().required().min(5).max(20).required(),
})

export const updateCategorySchema = joi.object({

    name:joi.string().required().min(5).max(20),
    id: joi.string().custom(objectID).required(),
}).required()


export const deleteCategorySchema = joi.object({

    id :joi.string().custom(objectID).required()

}).required()