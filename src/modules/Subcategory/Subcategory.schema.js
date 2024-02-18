import joi from "joi"
import{objectID} from "../../middleware/validation.middleware.js"

export const createSubcategorySchema = joi.object({

    name: joi.string().min(5).max(20).required(), // sub-category ID
    category : joi.string().custom(objectID).required() // category ID

}).required()


export const updateSubcategorySchema = joi.object({

    name:joi.string().required().min(5).max(20),
    id: joi.string().custom(objectID).required(), // sub-category ID
    category : joi.string().custom(objectID).required()  // category ID
}).required()


export const deleteSubcategorySchema = joi.object({

    id :joi.string().custom(objectID).required(),
    category : joi.string().custom(objectID).required()

}).required()

export const allSubcatigoriesSchema = joi.object({

    category : joi.string().custom(objectID)

}).required()