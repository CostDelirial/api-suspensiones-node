import { Router, Request, Response } from 'express'
import UserController from '../controllers/user.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';

const userRouter = Router()
const userController = new UserController()

userRouter.post('/', AuthMiddleware.autetication, userController.createUser.bind(userController))
userRouter.get('/', AuthMiddleware.autetication, userController.getUsers.bind(userController))

export default userRouter