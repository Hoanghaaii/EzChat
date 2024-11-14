import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/connectDb.js';
import router from './routers/index.router.js';


dotenv.config()
const app = express();

app.use(express.json())
app.use('/api',router)

app.get('/', (req, res)=>{
    res.send("EzChat Backend!")
})

const PORT = process.env.PORT
const server = app.listen(PORT, (req, res)=>{
    connectDB()
    console.log(`Server running at ${PORT}`)
})