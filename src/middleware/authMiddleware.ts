import { Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { AuthRequest } from "../types/global"
import { ITask } from "../types/types"

const secret = "your_jwt_secret"

export const authenticate = (req: AuthRequest,res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" })
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload
    req['user'] ={ ...decoded} as JwtPayload
    next()
  } catch (error) {
    res.status(401).send({ error: "Invalid token" })
  }
}

export const authorize = (role: "user" | "admin") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if ((req.user as ITask).role !== role) {
      return res.status(403).send({ success: false, error: "Forbidden" })
    }
    next()
  }
}
