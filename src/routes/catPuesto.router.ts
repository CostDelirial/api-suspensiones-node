import CatPuestoController from '../controllers/catPuesto.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catPuestoRouter = Router()
const catPuestoController = new CatPuestoController()

catPuestoRouter.post('/', AuthMiddleware.autetication, catPuestoController.createCatPuesto.bind(catPuestoController))
catPuestoRouter.get('/', AuthMiddleware.autetication, catPuestoController.getCatPuestos.bind(catPuestoController))
catPuestoRouter.post('/delete', catPuestoController.delete.bind(catPuestoController))

export default catPuestoRouter;
