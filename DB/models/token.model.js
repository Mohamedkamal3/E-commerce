import mongoose, { Schema, Types, Model } from "mongoose";

export const tokenSchema = new Schema({
token:{type:String , required:true},
user:{type:Types.ObjectId , ref:"User"},
isValid:{type:Boolean , default:true},
agent:{type:String},
expiredAt:{type:String}


},
    {
        timestamps: true
    })


export const Token = mongoose.model("Token",tokenSchema)