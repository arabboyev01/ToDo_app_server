import { Response } from "express"
import { Task } from "../models/task"
import { AuthRequest } from "../types/global"
import { ITask } from "../types/types"

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = new Task({ ...req.body, userId: (req.user as ITask).id })
    await task.save()
    res.status(201).send({ success: true, data: task })
  } catch (error) {
    res.status(400).send({ error: "Task creation failed", details: error })
  }
}

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: (req.user as ITask).id })
    res.status(200).send({ success: true, data: tasks });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch tasks", details: error })
  }
}

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find()
    res.status(200).send({ success: true, data: tasks });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch tasks", details: error })
  }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
    if (!task) {
      return res.status(404).send({ error: "Task not found" })
    }
    res.status(200).send({ success: true, data: task })
  } catch (error) {
    res.status(400).send({ error: "Task update failed", details: error })
  }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      ...((req.user as ITask).role !== "admin" && {
        userId: (req.user as ITask).id,
      }),
    })

    if (!task) {
      return res.status(404).send({ error: "Task not found" })
    }
    res.send({ success: true, message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).send({ error: "Task deletion failed", details: error })
  }
}

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: "$userId",
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: ["$completed", 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          email: "$user.email",
          totalTasks: 1,
          completedTasks: 1,
          completionRate: {
            $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100],
          },
        },
      },
    ])
    res.status(200).send({ success: true, data: stats })
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to fetch analytics", details: error })
  }
}