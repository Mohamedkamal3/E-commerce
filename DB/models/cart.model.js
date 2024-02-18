import mongoose, { Schema, Types, Model } from "mongoose";

export const cartSchema = new Schema({
products:[
    {
        productId:{type : Types.ObjectId , ref :"Product"},
        quantity:{type : Number , default : 1}
},
],
user:{type:Types.ObjectId , ref:"User" , required : true , unique : true}

},
    {
        timestamps: true , toJSON:{virtuals: true}, 
    })


export const Cart = mongoose.model("Cart",cartSchema)