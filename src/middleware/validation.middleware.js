import { Types } from "mongoose";

export const objectID = (value , helper)=>{
    if(Types.ObjectId.isValid(value)) return true;

    return helper.message("Invalid Object ID !! ")


}

export const validation =(schema)=>{
    return (req , res  ,next)=>{
        const data = {...req.body , ... req.params,...req.query}
        const validationResults = schema.validate(data,{abortEarly:false})
    
    if(validationResults.error){
        const errorMessages =validationResults.error.details.map((obj)=>obj.message
        )
      
        return next (new Error(errorMessages) , {cause:400})
        
    }
    return next()
    };
};