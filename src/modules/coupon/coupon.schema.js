import joi from "joi"


export const addCouponSchema = joi.object({
// we can use .options({convert:false}) with discount to only accept numbers 
discount : joi.number().integer().min(1).max(100).required(),
expiredAt: joi.date().greater(Date.now()).required()

}).required()




export const updateCouponSchema = joi.object({

    discount : joi.number().integer().min(1).max(100),
    expiredAt: joi.date().greater(Date.now()),
    code: joi.string().length(5).required()

}).required()



export const deleteCouponSchema = joi.object({
    code: joi.string().length(5).required()
}).required()