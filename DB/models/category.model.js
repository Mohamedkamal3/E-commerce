import mongoose, { Schema, Types, Model } from "mongoose";
import { Subcategory } from "./Subcategorys.model.js";

export const categorySchema = new Schema({
name :{type:String , required : true , unique : true , min :5 , max :20 },
slug : {type :String , required : true , unique : true},
createdBy : { type:Types.ObjectId , ref:"User"},
image :{id: {type:String},url: {type:String}},
brands: [{type: Types.ObjectId , ref :"Brand"}]
},
    {
        timestamps: true ,toJSON:{virtuals:true} , toObject:{virtuals:true}
    })

categorySchema.virtual("subcategory",{
ref:"Subcategory",
localField:"_id", // category field
foreignField:"category" // subcategory field

})
// post Hook 
categorySchema.post("deleteOne",{document:true , query:false},async function(){

    await Subcategory.deleteMany({
        category:this._id
    })

})

export const Category = mongoose.model("Category",categorySchema)