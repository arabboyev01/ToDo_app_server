import express from "express"
import mongoose from "mongoose" 
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"
import users from "./routes/usersRoutes"

const app = express()
dotenv.config({ path: '.env.local' })
const port = process.env.PORT
console.log(port)

app.use(express.json())
app.use(cors())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/tasks", taskRoutes)
app.use("/api/v1/user", users)

mongoose
  .connect("mongodb://127.0.0.1:27017/test_db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.13")
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })
