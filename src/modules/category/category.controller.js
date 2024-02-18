import cloudinary from "../../utils/cloud.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { Category } from "./../../../DB/models/category.model.js"
import slugify from "slugify";





export const createCategory = asyncHandler(async (req, res, next) => {

    // check file for image [multer]   
    if (!req.file) return next(new Error("Category image is required !!"), { cause: 400 })

    // upload image to cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.CLOUD_FOLDER}/category` })
    // save category to DB
    await Category.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url }
    })
    // send response
    return res.json({ success: true, message: "Category added successfuly" })
})


export const updateCategory = asyncHandler(async (req, res, next) => {
    // check for category existance on the DB

    const category = await Category.findById(req.params.id);
    if (!category) return next(new Error("Category not found !! ", { cause: 404 }))

    //check category Owner [only the owner can update the category]-
    // we used toString() as those are object ids
    if (req.user._id.toString() !== category.createdBy.toString())
        return next(new Error("You are not the category Creator!"))

    //check files => upload the file to cloudinary if it was sent 
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
            { public_id: category.image.id })

        category.image = { id: public_id, url: secure_url }
    }

    //update category 

    category.name = req.body.name ? req.body.name : category.name ;
    category.slug = req.body.name ? slugify(req.body.name) : category.slug
    await category.save()

    // response
    return res.json({success:true , message:"Category updated successfully !"})

})

export const deleteCategory= asyncHandler(async(req ,res  ,next)=>{

    //check for category on the DB 
    const category = await Category.findById(req.params.id);
    if (!category) return next(new Error("Category not found !! ", { cause: 404 }))
    //check for category's owner
    if (req.user._id.toString() !== category.createdBy.toString())
    return next(new Error("You are not the category Creator!"))

    //Delete the category from the DB 
 await Category.findByIdAndDelete(req.params.id)

    //delete the category image from cloudinary
await cloudinary.uploader.destroy(category.image.id)
    //return response
    return res.json({success:true , message:"Categroy deleted successfully!"})
})

export const allCategorys = asyncHandler(async(req , res  ,next)=>{

const results = await Category.find();

return res.json({success:true , results})

})