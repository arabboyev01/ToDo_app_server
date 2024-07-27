import { Router } from "express"
import {
  createTask,
  getTasks,
  getAllTasks,
  updateTask,
  deleteTask,
  getAnalytics,
} from "../controllers/taskController"
import { authorize, authenticate } from "../middleware/authMiddleware"

const router = Router()

router.post("/", authenticate, createTask)
router.get("/", authenticate, getTasks)
router.get("/all", authenticate, authorize("admin"), getAllTasks)
router.patch("/:id", authenticate, updateTask)
router.delete("/:id", authenticate, deleteTask)
router.get("/analytics", authenticate, authorize("admin"), getAnalytics)

export default router
