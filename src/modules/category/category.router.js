import { Router } from "express";
import {isAuthenticated} from "./../../middleware/authentication.middleware.js"
import {isAuthorized} from "./../../middleware/authorization.middleware.js"
import {validation} from "./../../middleware/validation.middleware.js"
import {fileUpload} from "./../../utils/fileUpload.js"
import * as categoryController from "./category.controller.js"
import * as categorySchema from "./category.schema.js"
import subcategoryRouter from "./../Subcategory/Subcategory.router.js"

const router = Router()

router.use("/:category/subcategory",subcategoryRouter)

//Create category
router.post("/createCategory", isAuthenticated,isAuthorized("admin"),fileUpload().single("category"),validation(categorySchema.createCategorySchema),categoryController.createCategory)
// Update category 
router.patch("/updateCategory/:id",isAuthenticated,isAuthorized("admin"),fileUpload().single("category"),validation(categorySchema.updateCategorySchema),categoryController.updateCategory)
// Delete category
router.delete("/deleteCategory/:id",isAuthenticated,isAuthorized("admin"),validation(categorySchema.deleteCategorySchema),categoryController.deleteCategory)
// Get all categorys
router.get("/allCategorys", categoryController.allCategorys)

export default router 