import { Router } from "express"
import { getSingleUser } from "../controllers/getUsers"
import { authenticate } from "../middleware/authMiddleware"

const users = Router()

users.get("/", authenticate, getSingleUser)

export default users
