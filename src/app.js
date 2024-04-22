import express from 'express';
import cors from "cors"
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

//it will parse incoming json to an object so we can access it in our request handlers and limit the size of the data to 16kb
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 

import userRouter from './routes/user.routes.js'

//routes declaration
//when we have to write the api then with route we have to provide the version on api , then we have to define that we have define apis
app.use("/api/v1/users",userRouter) 

// http://localhost:8000/api/v1/users/register

export { app }