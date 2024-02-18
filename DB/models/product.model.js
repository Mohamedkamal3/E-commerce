import mongoose, { Types , model, Schema} from "mongoose"

export const productSchema= new Schema({

    name:{type : String , required : true , min : 2 , max:20 },
    description :{type : String , min : 10 , max:200 },
    images :[{id:{type:String , required:true} , url:{type:String , required:true}}],
    defaultImage : {id:{type:String , required:true},url:{type:String , required:true}},
    availableItems:{type:Number , min: 1 ,required:true},
    soldItems:{type:Number , default:0},
    price:{type:Number , min : 1 , required:true},
    discount : {type:Number , min : 1 ,max :100},
    createdBy:{type :Types.ObjectId, ref:"User" , required:true},
    category:{type :Types.ObjectId, ref:"Category" , required:true},
    subcategory:{type :Types.ObjectId, ref:"Subcategory" , required:true},
    brand:{type :Types.ObjectId, ref:"Brand" , required:true},
    cloudFolder:{type:String , required:true},
    averageRate:{type:Number , min: 1 , max :5},

},{timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true} , strictQuery:true})

productSchema.virtual("review"),{
    ref:"Review",
    localField:"_id",
    forgenField:"productId"

}

productSchema.virtual("finalPrice").get(function(){

    return Number.parseFloat(this.price - (this.price * this.discount || 0) / 100).toFixed(2)

})

// Query helper XXX
productSchema.query.paginate = function (page){
        //pagination
        page = page < 1 || isNaN(page) || !page ? 1:page;
        const limit = 2 // >> 1 product per page
        const skip = limit * (page -1)

        return this.skip(skip).limit(limit)

}

productSchema.query.search = function (keyword) {
    if (keyword) {
        return this.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        });
    } else {
        return this; // Return the original query if no keyword is provided
}
};
productSchema.methods.inStock = function (requiredQuantity) {
    //this >> document >> product
    return this.availableItems >= requiredQuantity ? true : false;

};

export const Product = mongoose.model("Product",productSchema)