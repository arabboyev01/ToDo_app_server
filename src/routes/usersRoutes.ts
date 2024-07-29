import { Router } from "express"
import { getSingleUser, getAllUsers } from "../controllers/getUsers";
import { authenticate, authorize } from "../middleware/authMiddleware";

const users = Router()

users.get("/", authenticate, getSingleUser)
users.get("/all", authenticate, authorize('admin'), getAllUsers);

export default users
