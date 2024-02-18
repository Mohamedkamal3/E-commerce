import mongoose, { Schema, Types, Model } from "mongoose";

export const reviewSchema = new Schema({
rating:{type:Number , required:true , min :1 ,Max:5},
comment:{type:String ,required:true  },
createdBy:{type:Types.ObjectId , ref:"User" , required : true },
productId:{type:Types.ObjectId , ref:"Product" ,required : true },
orderId:{type:Types.ObjectId , ref:"Order" ,required : true },

},
    {
        timestamps: true , 
    })


export const Review = mongoose.model("Review",reviewSchema)