import { Router, Request, Response } from 'express'
import UserController from '../controllers/user.controller';
import Authenticate from '../middlewares/authenticate.middleware';

const userRouter = Router()
const userController = new UserController()
const checkToken = new Authenticate()

userRouter.post('/',checkToken.autetication, async(req: Request, res: Response ) => {
    try{
        const isAdmin= req.body.user_client
        const body = req.body
        const response = await userController.createUser(body,isAdmin)
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code : 500)
    }
})

userRouter.get('/', checkToken.autetication, async(req:Request, res: Response) => {
    try{
        const response = await userController.getUsers()
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code : 500)
    }
})
userRouter.get('/:idUser',checkToken.autetication, async(req: Request, res: Response) => {
    try{
        const idUser = req.params.idUser
        const response = await userController.getUserById(parseInt(idUser))
        return res.status(response.code).json(response)
    }catch(err: any ){
        return res.status(err.code ? err.code : 500).json(err)
    }
})
export default userRouter