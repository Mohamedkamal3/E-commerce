


// we will add this middle ware after the authentication 
//just to make sure that the user has the reuired role
//to procced to the next  we will get the user from the authentication middle ware 
// from req.user 
export const isAuthorized = (...roles)=>{

        return async(req , res  ,next)=>{

            if(!roles.includes(req.user.role))

            return next (new Error("You are not Authorized to procced !!",{ cause:403 }))

            return next()
        }


}