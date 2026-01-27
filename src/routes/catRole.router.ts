import CatRoleController from '../controllers/catRole.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catRoleRouter = Router()
const catRoleController = new CatRoleController()

catRoleRouter.post('/', AuthMiddleware.autetication, catRoleController.createCatRole.bind(catRoleController))
catRoleRouter.get('/', AuthMiddleware.autetication, catRoleController.getCatRoles.bind(catRoleController))
catRoleRouter.post('/update/:uuid', AuthMiddleware.autetication, catRoleController.updateCatRole.bind(catRoleController))

export default catRoleRouter;
