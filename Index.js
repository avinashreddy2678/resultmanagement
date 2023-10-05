import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import { teacherrouter } from "./Routes/TeacherRoutes.js";
import dotenv from 'dotenv'

dotenv.config();
const app=express();
mongoose.connect(process.env.MONGODB)
app.use(cors());
app.use(express.json());

app.use('/',teacherrouter);
app.listen(process.env.PORT||'8000',()=>{
  console.log("connected");
})










