import { asyncHandler } from "./../../utils/asyncHandler.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { User } from "./../../../DB/models/user.model.js"
import { Token } from "./../../../DB/models/token.model.js"
import { sendEmails } from "../../utils/sendEmail.js";
import { signUpTemp , resetPassTemp } from "../../utils/htmlTemplates.js";
import { Cart } from "../../../DB/models/cart.model.js";

export const register = asyncHandler(async (req, res, next) => {
    // get user data from the request 
    const { userName, email, password, gender, role, phone } = req.body
    // check for user existance 
    const user = await User.findOne({ email })
    if (user) return next(new Error("Email already existed !!"), { cause: 409 })
    //Generate token 
    const token = jwt.sign({ email }, process.env.SECRET_KEY)
    //Create User
    await User.create({ ...req.body})
    // create confirmation link
    const confirmationlink = `http://localhost:3000/auth/activate_account/${token}`
    // send E-mail
    const sent = sendEmails({ to: email, subject: "Account Activation", html: signUpTemp(confirmationlink) })
    if (!sent) return next(new Error("Some thing went wrong !!"))
    // send response 
    return res.status(201).json({ success: true, message: "Please check your email for activation link" })

})

export const activate_account = asyncHandler(async (req, res, next) => {
    //get token in params
    const { token } = req.params
    //verify the token to get the email from payload
    const { email } = jwt.verify(token, process.env.SECRET_KEY)
    //find user , update isConfirmed
    const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });
    // check user existance 
    if (!user) return next(new Error("User not found !!", { cause: 404 }))

    //Create a cart 
    await Cart.create ({user :user._id})
    //send response
    return res.json({ success: true, message: "Account activated successfuly!!" })


})

export const Login = asyncHandler(async (req, res, next) => {
    // get user data from the request 
    const { email, password } = req.body;

    //check for user existance
    const user = await User.findOne({ email })
    if (!user) return next(new Error("Email is invalid !! ", { cause: 404 }))

    //check if the accout is activated
    if (!user.isConfirmed) return next(new Error("Please activate your account !!"))

    //check password
    const match = bcryptjs.compareSync(password, user.password)
    if (!match) return next(new Error("You have entered a wrong password !! "))

    //generate token
    const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY)

    //save Token in the Token model
    await Token.create({ token, user: user._id })

    //send response 
    return res.json({ success: true, results: { token } })

})


export const frogetCode= asyncHandler(async(req , res ,next)=>{
    // get email from request 
    const {email}=req.body
    // find if the user is in the DB or not 
    const user = await User.findOne({email})
    if(!user)return next (new Error("Invalid Email !!"))
    // check if the account is activated 
    if(!user.isConfirmed){
        return next (new Error("Account is not activated!!"))
    }
    // generate a random forget code 
    const forgetCode = randomstring.generate({length:5 , charset:"alphanumeric"})
    // add the forget code to the user on the DB 
    user.forgetCode = forgetCode
    await user.save()
    // send email with th forget code to the user 
    const sent = sendEmails({to:email , subject:"Reset Code ",html:resetPassTemp(forgetCode)})
    // send response
    return res.json({success:true , message:"Check your Email for reset Code "})
})

export const resetPassword = asyncHandler(async(req , res  ,next )=>{
    const {email , password , forgetCode} = req.body;

    // find if the user is in the DB or not 
  const user = await User.findOne({email})
  if(!user)return next (new Error("Invalid Email !!"))
  // check if the account is activated 
  if(!user.isConfirmed){
      return next (new Error("Account is not activated!!"))
  }
  //check if the forget code entered is the correct code 
  if(forgetCode !== user.forgetCode)return next (new Error("you have entered a wrong code"))
// save
await user.save()

const tokens =await Token.find({user:user._id})
// invalidate all tokens 
tokens.forEach(async (token) => {
    token.isValid=false
    await token.save()
});
// return response
return res.json({success:true , message:"Try to login now !! "}) 

})


export const changePassword = asyncHandler(async (req, res, next) => {


    const isUser = await User.findById(req.user._id);

    const match = bcryptjs.compareSync(req.body.password, isUser.password)
    if (!match) {
        return next(new Error("Current password is incorrect."));
    }
    
    isUser.password = req.body.newPassword;
    await isUser.save();
    return res.json({ success: true, message: "Password Updated successfully !!", results: { isUser } })

})

export const logout = asyncHandler(async (req, res, next) => {

    const { token } = req.headers

    await Token.findOneAndUpdate({ token }, { isValid: false })

    return res.json({ success: true, message: "Logged Out!!" })


})

