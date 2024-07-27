import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/user"

const secret = "your_jwt_secret"

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body
    const user = new User({ email, password, role })
    await user.save()
    res.status(201).send({ success: true, message: "User registered successfully" })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, error: "Registration failed", details: error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ success: false, error: "Invalid email or password" })
    }
    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "1h",
    });
    res.send({ success: true, token, message: 'Logged in' });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error: "Login failed", details: error });
  }
}
