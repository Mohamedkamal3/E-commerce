import mongoose from "mongoose";

export const connectDB =async()=>{
    return await mongoose.connect(process.env.CONNECTION_URL).then(()=>console.log("DB Connected successfully"))
    .catch(()=>console.log("falied to connect to DB"));
}