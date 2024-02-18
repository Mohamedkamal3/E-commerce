import multer , {diskStorage} from "multer"

export const fileUpload = ()=>{
    const fileFilter = (req , file , cb)=>{
    // check the mimeType
    if(!["image/png","image/jpeg" , "image/jpg"].includes(file.mimetype))
        return cb (new Error("Invalid Format"),false)

        return cb (null , true )

    }

    return multer({storage : diskStorage({}), fileFilter})

}

