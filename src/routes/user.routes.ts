import { Router, Request, Response } from 'express'
import UserController from '../controllers/user.controller';
import Authenticate from '../middlewares/authenticate.middleware';

const userRouter = Router()
const userController = new UserController()
const checkToken = new Authenticate()


userRouter.post('/', userController.createUser.bind(userController))
userRouter.get('/', userController.getUsers.bind(userController))

export default userRouter