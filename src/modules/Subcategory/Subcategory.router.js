import { Router } from "express";
import {isAuthenticated} from "../../middleware/authentication.middleware.js"
import {isAuthorized} from "../../middleware/authorization.middleware.js"
import {validation} from "../../middleware/validation.middleware.js"
import {fileUpload} from "../../utils/fileUpload.js"
import * as subcategoryController from "./Subcategory.controller.js"
import * as subcategorySchema from "./Subcategory.schema.js"

const router = Router({mergeParams:true})

//Create Sub-Category
router.post("/createSubcategory",isAuthenticated,isAuthorized("admin"),fileUpload().single("subcategory")
,validation(subcategorySchema.createSubcategorySchema),
subcategoryController.createSubcategory)

//update sub-category
router.patch("/updateSubcategory/:id",isAuthenticated,isAuthorized("admin"),fileUpload().single("subcategory"),
validation(subcategorySchema.updateSubcategorySchema),subcategoryController.updateSubcategory)

//delete sub-category
router.delete("/deleteSubcategory/:id",isAuthenticated,isAuthorized("admin"),
validation(subcategorySchema.deleteSubcategorySchema),subcategoryController.deleteSubcategory)

// All sub-categories
router.get("/allSubcatigories",validation(subcategorySchema.allSubcatigoriesSchema),subcategoryController.allSubcatigories)





export default router