import mongoose, { Schema , Types , Model } from "mongoose";
import bcryptjs from "bcryptjs"

export const userSchema =new Schema ({
userName:{type:String , required:true},
email:{type:String ,unique:true, required : true,lowercase:true},
password:{type:String , required:true},
isConfirmed:{type:Boolean , default:false},
gender:{type:String , enum:["male","female"]},
phone:{type:String , unique:true , required:true},
role:{type:String , enum:["user","seller" , "admin"],default:"user"},
forgetCode:String,
profileImage:{url:{type:String ,
     default:"https://res.cloudinary.com/dnzymkywr/image/upload/v1707055697/E-Commerce/users/defaults/profilePic/depositphotos_133351986-stock-illustration-default-placeholder-man-and-woman_uyjqdx.webp"} ,
      id:{type:String,
         default:"E-Commerce/users/defaults/profilePic/depositphotos_133351986-stock-illustration-default-placeholder-man-and-woman_uyjqdx"}},
coverImage:{url:{type:String,
default:"https://res.cloudinary.com/dnzymkywr/image/upload/v1707056161/E-Commerce/users/defaults/profilePic/plain-black-background-02fh7564l8qq4m6d_cg1jny.jpg"} , 
id:{type:String,
    default:"E-Commerce/users/defaults/profilePic/plain-black-background-02fh7564l8qq4m6d_cg1jny"}}



},{timestamps:true});

//pre-save hook
userSchema.pre("save", function() {
    if(this.isModified("password")){
        this.password= bcryptjs.hashSync (this.password,parseInt(process.env.SALT_ROUND))

    }

})

export const User = mongoose.model("User",userSchema);




