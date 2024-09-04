import { Router, Request, Response } from 'express'
import UserController from '../controllers/user.controller';
import Authenticate from '../middlewares/authenticate.middleware';

const userRouter = Router()
const userController = new UserController()
const checkToken = new Authenticate()

userRouter.post('/',checkToken.autetication, async(req: Request, res: Response ) => {
    try{
        const body = req.body
        const response = await userController.createUser(body)
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code : 500)
    }
})

export default userRouter