import jwt  from "jsonwebtoken"
import { Token } from "./../../DB/models/token.model.js"
import { User } from "./../../DB/models/user.model.js"
import { asyncHandler } from "./../utils/asyncHandler.js"

export const isAuthenticated = asyncHandler(async (req, res, next) => {
// checking for token existance
    let token = req.headers["token"]
// check if the token was sent or not 
if(!token)return next(new Error("Token is required !!"))

// check the bearer key 
if(!token.startsWith(process.env.BEARER_KEY)) return next(new Error ("You have sent an invalid Token !!"))

// extract the payload
token = token.split(process.env.BEARER_KEY)[1]

const payload=jwt.verify(token, process.env.SECRET_KEY)

//check if the token is in the DB or not 
  const tokenDB =  await Token.findOne({token , isValid:true})
    if(!tokenDB)return next(new Error("Invalid Token !!"))

// check for User existance
const user = await User.findById(payload.id);
if(!user) return next (new Error("User not found !!" , {cause :404}))

//pass user 
req.user = user;

// next to move to the next controller 
return next();




})