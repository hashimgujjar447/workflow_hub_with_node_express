import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()


import authRouter from "./modules/auth/auth.routes"

app.use(cors())

app.use(express.json())

app.use(cookieParser())


app.use("/api/auth",authRouter)


app.get("/",(req,res)=>{
    res.json({
          message: "WorkflowHub API Running 🚀",
    })
})



export default app