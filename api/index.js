import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import adminRouter from "./routes/user.js"
import candidatRouter from "./routes/candidats.js"
import posteRouter from "./routes/postes.js"
import tagsRouter from "./routes/tags.js"
import bodyParser from 'body-parser'
import cors from 'cors'
import uploadRoutes from './routes/Upload.js'
import path from 'path'

const app = express()

dotenv.config()

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.json())

app.use("/auth",candidatRouter)
app.use("/auth",posteRouter)
app.use("/auth",adminRouter)
app.use("/auth",tagsRouter)
app.use('/api/upload', uploadRoutes)


const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


const connect = async () =>{
    try {
       await mongoose.connect(process.env.MONGO);
       console.log("connected");
    }
     catch (error) {
       throw(error);
    }
};

app.listen(8800,()=>{
    connect();
    
})

