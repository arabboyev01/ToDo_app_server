import { Schema, model, Document } from "mongoose"
import bcrypt from "bcrypt"

interface IUser extends Document {
  email: string
  password: string
  role: "user" | "admin"
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
})

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt);
  next()
})

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = model<IUser>("User", UserSchema)
