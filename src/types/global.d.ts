import { Request } from "express"
import { ITask } from "./types"
import { JwtPayload } from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: ITask | string | JwtPayload
}