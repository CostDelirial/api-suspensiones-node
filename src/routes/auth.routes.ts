import AuthControll from "../controllers/auth.controller"
import { Router, Request, Response } from "express"


const authRouter = Router()
const authController = new AuthControll

authRouter.post('/', async(req: Request, res: Response) => {
    try{
        const { ficha, password } = req.body
        const response = await authController.Login(ficha, password)
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code : 500)
    }
})

export default authRouter