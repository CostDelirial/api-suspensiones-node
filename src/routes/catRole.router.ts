import CatRoleController from '../controllers/catRole.controller';
import { Router, Request, Response } from "express";

const catRoleRouter = Router()
const catRoleController = new CatRoleController()

catRoleRouter.post('/', catRoleController.createCatRole.bind(catRoleController))
catRoleRouter.get('/', catRoleController.getCatRoles.bind(catRoleController))
catRoleRouter.post('/delete', catRoleController.delete.bind(catRoleController))

export default catRoleRouter;
