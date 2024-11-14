import s3 from './aws.config.js'
import multer from 'multer'
import {PutObjectCommand} from '@aws-sdk/client-s3'

const storage = multer.memoryStorage()
const upload = multer({storage})

export const postFile = async (req, prefix)=>{
    const file = req.file
    if(!file){
        return {message: "File not found!"}
    }
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${prefix}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    }
    try {
        const command = new PutObjectCommand(params)
        const data = await s3.send(command)
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
        return {
            success: true,
            message: "File uploaded successfully!",
            fileUrl
        }
    } catch (error) {
        return {
            success: false,
            message: "Server error",
            error: error.message
        }
    }
}


export const uploadFileMiddleWare = upload.single('file')

export const uploadAvatarMiddleWare = upload.single('avatar')