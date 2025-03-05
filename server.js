import express from "express";
import cors from "cors";
import { config } from "dotenv";
import userRouter from './router/userRouter.js'
import bookRouter from './router/bookRouter.js'
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/db.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary"

const app = express()
config({ path: './config/config.env' })


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173' || process.env.FRONTEND_URL],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

console.log()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Hello Book Review System.."
    })
})


app.use("/api/v1/user", userRouter)
app.use("/api/v2/book", bookRouter)


app.listen(8000, () => {
    console.log("server is running at port: ", 8000)
})


dbConnection()