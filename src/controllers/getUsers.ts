import { Response, Router } from "express"
import { AuthRequest } from "../types/global"
import { User } from "../models/user"
import { ITask } from "../types/types"

export const getSingleUser = async (req: AuthRequest, res: Response) => {
   try{
     const user = await User.findById((req?.user as ITask)?.id)
     if(!user){
        return res.status(404).json({
            status: false,
            message: "User not found"
          })
     }

     return res.status(200).json({ status: true, data: user})
   } catch(err: unknown){
    return res.status(500).json({ status: false, message: "Internal server error" + (err as Error).message})
   }
}


