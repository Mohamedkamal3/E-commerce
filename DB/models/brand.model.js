import mongoose, { Schema, Types, Model } from "mongoose";

export const brandSchema = new Schema({
name :{type:String , required : true , unique : true , min :2 , max :20 },
slug : {type :String , required : true , unique : true},
createdBy : { type:Types.ObjectId , ref:"User"},
image :{id: {type:String , required: true},url: {type:String , required: true}},


},
    {
        timestamps: true , toJSON:{virtuals: true}, 
    })


export const Brand = mongoose.model("Brand",brandSchema)