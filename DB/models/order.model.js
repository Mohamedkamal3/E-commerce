import mongoose, { Types , model, Schema} from "mongoose"

export const orderSchema= new Schema({
    user : {type : Types.ObjectId , ref :"User" , required :true},
    address:{type : String , required : true },
    products :[{
        productId:{type :Types.ObjectId ,ref:"Product", required : true },
        quantity:{type :Number , min:1},
        name:String,
        itemPrice:Number,
        totalPrice:Number,
    }],
    payment : {type : String , enum:["cash","visa"] ,default :"cash"},
    phone:{type:String ,  required :true},
    price:{type:Number , required :true},
    invoice:{url:String ,id:String},
    coupon:{id:{type:Types.ObjectId,ref:"Coupon"},
                name:String,
                discount:Number
},
    status:{type:String ,enum:["placed","shipped","delivered","canceled","refunded"],default :"placed"},
   


},{timestamps:true})

orderSchema.virtual("finalPrice").get(function(){

    return this.coupon ?

    Number.parseFloat(this.price - (this.price * this.coupon.discount || 0) / 100)
    .toFixed(2): this.price;

})

export const Order = mongoose.model("Order",orderSchema)