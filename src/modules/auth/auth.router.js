import { Router } from "express"; 
import * as authcontroller from "./auth.controller.js"
import * as authSchema from "./auth.schema.js"
import { validation } from "../../middleware/validation.middleware.js";
import {isAuthenticated} from "./../../middleware/authentication.middleware.js"
const router = Router()

//Register 
router.post("/register",validation(authSchema.registerSchema),authcontroller.register)
//Activate Account 
router.get("/activate_account/:token",validation(authSchema.activateAccountSchema),authcontroller.activate_account)
//Login
router.post("/Login",validation(authSchema.loginSchema),authcontroller.Login)
//Send forget code 
router.patch("/forgetCode",validation(authSchema.forgetCodeSchema),authcontroller.frogetCode)
//Reset password 
router.patch("/resetPassword",validation(authSchema.resetPasswordSchema),authcontroller.resetPassword)
//Change password
router.patch("/changePassword",validation(authSchema.changePasswordSchema) ,isAuthenticated, authcontroller.changePassword )
//Logout 
router.post("/logout",isAuthenticated,authcontroller.logout)


export default router;