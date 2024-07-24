import express from "express"
import multer from "multer";
import cors from "cors"
import { blogs } from "./models/Blog.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const app=express();

mongoose.connect(process.env.DATABASE_URL+"blog-app")

const port=process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}.${file.originalname}`)
    }
})
  
const upload = multer({ storage: storage })

app.use(express.json())
app.use(cors()) 
app.use('/uploads', express.static('uploads'))

app.get("/", (req, res)=>{
    res.json({"message":"Hello World!"});
})

app.get("/blog/:cat", async (req, res)=>{
    const result=await blogs.find(req.params.cat!='all' ? {category : req.params.cat} : {});
    res.json({"data": result});
})

app.get("/blog/id/:id", async (req, res)=>{
    const result=await blogs.find({_id : req.params.id});
    res.json({"data": result});
})

app.post("/blog", async (req, res)=>{
    const result=await blogs.insertMany({title: req.body.title, image: req.body.image, post: req.body.post, category: req.body.category});
    res.json({"message": "Added a new blog", "desc": result.rowCount});
})

app.post('/blogimage', upload.single('file'), function (req, res, next) {
    res.json(req.file)
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})