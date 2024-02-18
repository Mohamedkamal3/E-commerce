import cloudinary from "../../utils/cloud.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/category.model.js"
import {Subcategory} from "../../../DB/models/Subcategorys.model.js"
import slugify from "slugify";


export const createSubcategory = asyncHandler(async (req, res, next) => {

    //check for category existance 
    const category = await Category.findById(req.params.category)
    if(!category) return next (new Error ("Category not found !! "))

    // check file for image [multer]   
    if (!req.file) return next(new Error("Subcategory image is required !!"), { cause: 400 })

    // upload image to cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.CLOUD_FOLDER}/subcategory` })
    // save sub-category to DB
    await Subcategory.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        category:req.params.category,
    })
    // send response
    return res.json({ success: true, message: "Sub-category added successfuly" })
})


export const updateSubcategory = asyncHandler(async (req, res, next) => {
    
    // check for category existance on the DB
    const category = await Category.findById(req.params.category);
    if (!category) return next(new Error("Category not found !! ", { cause: 404 }))

    // check for Sub-category existance on the DB
    // check if the category is the sub-category's parent ot not
    const subcategory = await Subcategory.findOne({
        _id: req.params.id,
        category: req.params.category
    })
   
    if(!subcategory) return next 
    (new Error("Not allowed to update the sub-category!") , {cause :404})

    //check category Owner [only the owner can update the category]-
    // we used toString() as those are object ids
    if (req.user._id.toString() !== category.createdBy.toString())
        return next(new Error("You are not the category Creator!"))

    //check files => upload the file to cloudinary if it was sent 
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
            { public_id: subcategory.image.id })

        subcategory.image = { id: public_id, url: secure_url }
    }

    //update sub-category 

    subcategory.name = req.body.name ? req.body.name : subcategory.name ;
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug
    await subcategory.save()

    // response
    return res.json({success:true , message:"Sub-category updated successfully !"})

})



export const deleteSubcategory= asyncHandler(async(req ,res  ,next)=>{

    //check for category on the DB 
    const category = await Category.findById(req.params.category);
    if (!category) return next(new Error("Category not found !! ", { cause: 404 }))

     // check for Sub-category existance on the DB
    // check if the category is the sub-category's parent ot not
    const subcategory = await Subcategory.findOne({
        _id: req.params.id,
        category: req.params.category
    })
   
    if(!subcategory) return next 
    (new Error("Not allowed to Delete the sub-category!") , {cause :404})
   

    //check for Subcategory's owner
    if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("You are not the category Creator!"))

    //Delete the Subcategory from the DB 
 await Subcategory.deleteOne()

    //delete the Subcategory image from cloudinary
await cloudinary.uploader.destroy(subcategory.image.id)
    //return response
    return res.json({success:true , message:"Subcategroy deleted successfully!"})

})

export const allSubcatigories = asyncHandler(async(req  ,res ,next)=>{

    //check for category on the DB 
    const category = await Category.findById(req.params.category);
    if (!category) return next(new Error("Category not found !! ", { cause: 404 }))    
    // if we wants to get all the sub-categories of 1 category 
    if(req.params.category !== undefined){
    const results = await Subcategory.find({category:req.params.category})
    return res.json({success:true , results})
}
                                                          // multiple populate
    const results = await Subcategory.find().populate([{path:"category",select : "name -_id"},
    {path:"createdBy"}])

    return res.json({success:true , results})

})