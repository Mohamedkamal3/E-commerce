import { asyncHandler } from "./../../utils/asyncHandler.js";
import {Coupon} from "./../../../DB/models/coupon.model.js"
import voucher_codes from "voucher-code-generator"

export const addCoupon = asyncHandler(async(req , res , next )=>{

    // Generate coupon 
    const code =  voucher_codes.generate({length:5})

    //create coupon on the DB 
    const coupon = await Coupon.create({
        name:code[0],
        createdBy:req.user._id,
        discount : req.body.discount,
        expiredAt: new Date(req.body.expiredAt).getTime()

    })
  // send response 
  return res.status(201).json({success: true , results :{coupon}})


})


export const updateCoupon = asyncHandler(async(req , res , next )=>{
    //check for code existance
    const coupon = await Coupon.findOne({name : req.params.code , expiredAt:{$gt: Date.now()}})

    if(!coupon) return next (new Error("Invalid Coupon!", {cause : 404}))

    // check for user 
    if(req.user.id != coupon.createdBy.toString())
    return next (new Error("Only the Owner can update!!",{cause :403}))

    // update the data that will come in req.body
         coupon.discount = req.body.discount ? req.body.discount : coupon.discount ;
        coupon.expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt).getTime(): coupon.expiredAt;

        await coupon.save()

        //responce
        return res.status(201).json({success:true , message:"Coupon updated successfully!"})

})

export const deleteCoupon = asyncHandler(async(req , res  ,next )=>{

// check for coupon existance 
const coupon = await Coupon.findOne({name : req.params.code})
if(!coupon) return next (new Error("Invalid Coupon!", {cause : 404}))

   // check for user 
   if(req.user.id != coupon.createdBy.toString())
   return next (new Error("Only the Owner can update!!",{cause :403}))

   // delete coupon
    await coupon.deleteOne()
  // response
   return res.json({success:true , message:"Coupon Deleted successfully!"})
})

export const allCoupons = asyncHandler(async(req , res , next)=>{
    // admin >> send all coupons
    if(req.user.role === "admin"){
        const coupons = await Coupon.find()
        return res.json({success: true , results:{coupons}})
    }
    
    // seller >> send his coupons only 

    else if(req.user.role === "seller"){
        const coupon =await Coupon.find({createdBy:req.user.id})
        return res.json({success: true , results:{coupon}})
    }

})