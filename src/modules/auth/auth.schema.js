import joi from "joi";

// Register 
export const registerSchema = joi.object({
    userName: joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required(),
    gender:joi.string(),
    phone:joi.string(),
    role:joi.string()

}).required()
//Activate account
export const activateAccountSchema = joi.object({

token :joi.string().required()

}).required()

//Login
export const loginSchema =joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()

}).required()

export const forgetCodeSchema = joi.object({
    
    email:joi.string().email().required()

}).required()

export const resetPasswordSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required(),
    forgetCode:joi.string().length(5).required()

})

export const changePasswordSchema = joi.object({
    password :joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    newPassword : joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required()

}).required()