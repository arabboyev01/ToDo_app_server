import { Schema } from "mongoose";

export interface ITask extends Document {
  id: string | undefined
  title: string;
  description: string;
  completed: boolean;
  userId: Schema.Types.ObjectId;
  role: "user" | "admin";
}
