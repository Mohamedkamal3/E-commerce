import { asyncHandler } from "./../../utils/asyncHandler.js";
import { Coupon } from "./../../../DB/models/coupon.model.js"
import { Category } from "./../../../DB/models/category.model.js"
import { Subcategory } from "./../../../DB/models/Subcategorys.model.js"
import { Brand } from "./../../../DB/models/brand.model.js"
import { Product } from "./../../../DB/models/product.model.js"
import voucher_codes from "voucher-code-generator"
import cloudinary from "../../utils/cloud.js";
import { nanoid } from "nanoid";



export const createProduct = asyncHandler(async (req, res, next) => {
    // check for category existance
    const category = await Category.findById(req.body.category)
    if (!category) return next(new Error("Category not found!"))
    // check for subcategory existance
    const subcategory = await Subcategory.findById(req.body.subcategory)
    if (!subcategory) return next(new Error("Subcategory not found!"))
    // check for brand existance
    const brand = await Brand.findById(req.body.brand)
    if (!brand) return next(new Error("Brand not found!"))

    // check files 
    if (!req.files) return next(new Error("Product images are required!" ,{cause :400}))

    //create folder name
    const cloudFolder = nanoid()

    let images = []

    //upload sub images
    for (const file of req.files.subImage) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { folder: `${process.env.CLOUD_FOLDER}/products/${cloudFolder}` })
        images.push({ id: public_id, url: secure_url })
    }

    //upload default images
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.defaultImage[0].path
        , { folder: `${process.env.CLOUD_FOLDER}/products/${cloudFolder}` })
    // create product
    const product = await Product.create({
        ...req.body,
        cloudFolder,
        createdBy: req.user._id,
        defaultImage: {id:public_id,url:secure_url},
        images,

    })

    //response
    return res.json({ success: true, message: "Product created successfully!" })
})

export const deleteProduct = asyncHandler(async(req, res ,next)=>{

    // check for product existance then delete
    const product = await Product.findByIdAndDelete(req.params.id)
     if(!product)return next (new Error("product is not found !",{cause :404}))

    //check Owner
     if(req.user._id.toString() != product.createdBy.toString())
     return next (new Error("You are not Authorized to Delete!",{cause :401}))

    //delete product from DB 
    await product.deleteOne()

    //delete the product image from cloudinary
    const ids= product.images.map((image)=> image.id)
    ids.push(product.defaultImage.id)
    await cloudinary.api.delete_resources(ids)

    // delete image folder 

    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER}/products/${product.cloudFolder}`)

    // respose
    return res.json({success:true , message: "Product Deleted successfully!"})
})

export const allProducts = asyncHandler(async(req , res  ,next)=>{
    const {keyword , sort , page , category , subcategory , brand}=req.query;
    if(category && !(await Category.findById(category)))
    return next (new Error ("Category not found !"))

    if(subcategory && !(await Subcategory.findById(subcategory)))
    return next (new Error ("Subcategory not found !"))

    if(brand && !(await Brand.findById(brand)))
    return next (new Error ("Brand not found !"))
 
    const results =await Product.find({...req.query}).sort(sort).paginate(page).search(keyword)

    return res.json({success:true , results})
       // search , filter , sort , pagination
    //Search >> here the search will be by the word sent in Query 
    //[we will search by the Word even if it was included in another word and we used i for it to be case-incestive ]
    // filter >> we used strictQuery in product schema 
})
