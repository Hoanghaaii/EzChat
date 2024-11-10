import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDb Connected!")
    } catch (error) {
        console.log("Error connection to MongoDb", error.message)
        process.exit(1)
    }
}