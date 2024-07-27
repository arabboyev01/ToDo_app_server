import { Schema, model } from "mongoose"
import { ITask } from "../types/types"


const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
})

export const Task = model<ITask>("Task", TaskSchema)
