import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloud.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import slugify from "slugify";


export const addBrand = asyncHandler(async(req , res , next)=>{
    // check for categories existance
    const {categories} = req.body
    categories.forEach(async(categoryID)=> {
        const category =await Category.findById(categoryID)
        if(!category) return next(new Error(`category ${categoryID} not found !`,{cause: 404}))
    });

    // check for files
    if(!req.file) return next (new Error ("Brand image is required !", {cause :400}))

    // upload file to cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.CLOUD_FOLDER}/brands` })

        // save brand to DB
        const brands =await Brand.create({
            name: req.body.name,
            slug: slugify(req.body.name),
            createdBy: req.user._id,
            image: { id: public_id, url: secure_url }
        })

        //save brands in each category
        categories.forEach(async(categoryID)=> {
            const category = await Category.findByIdAndUpdate(categoryID , {$push:{brands :brands._id}})
  
        });
        // response
        return res.json({success:true , message:"Brand added successfully!"})

})

export const updateBrand = asyncHandler(async(req , res  ,next)=>{
    const brand = await Brand.findById(req.params.id)
    
    if(!brand)return next (new Error("Brand is not found !",{cause :404}))

    
    if(req.file){
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.CLOUD_FOLDER}/brands` })
        }
    
        brand.name = req.body.name ? req.body.name : brand.name ;
        brand.slug = req.body.name ? slugify(req.body.name) : brand.slug

        await brand.save()

        //response
        return res.json({success:true , message:"Brand updated successfully!"})
})

export const deleteBrand = asyncHandler(async(req , res , next)=>{
    // check for brand existance then delete
    const brand = await Brand.findByIdAndDelete(req.params.id)
     if(!brand)return next (new Error("Brand is not found !",{cause :404}))

    //delete the brand image from cloudinary
    await cloudinary.uploader.destroy(brand.image.id)
   
    //delete brands from categories 
    await Category.updateMany({},{brands: req.params.id})

    return res.json({success:true , message: "Brand Deleted successfully!"})
})

export const allBrands = asyncHandler(async(req , res , next )=>{

    const brand = await Brand.find()
    return res.json({success:true , results: brand})

})