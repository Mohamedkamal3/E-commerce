import { Router } from "express";
import {isAuthenticated} from "./../../middleware/authentication.middleware.js"
import {isAuthorized} from "./../../middleware/authorization.middleware.js"
import {validation} from "./../../middleware/validation.middleware.js"
import {fileUpload} from "./../../utils/fileUpload.js"
import * as brandController from "./brand.controller.js"
import * as brandSchema from "./brand.schema.js"
import subcategoryRouter from "./../Subcategory/Subcategory.router.js"

const router = Router()

//create brand
router.post("/addBrand",isAuthenticated,isAuthorized("admin"),fileUpload().single("brand")
,validation(brandSchema.addBrandSchema),
brandController.addBrand)
//update brand 
router.patch("/updateBrand/:id",isAuthenticated,isAuthorized("admin"),fileUpload().single("brand")
,validation(brandSchema.updateBrandSchema),
brandController.updateBrand)
// delete brand
router.delete("/deleteBrand/:id",isAuthenticated,isAuthorized("admin"),validation(brandSchema.deletebrandSchema),brandController.deleteBrand)

//all brands 
router.get("/allBrands",brandController.allBrands)


export default router