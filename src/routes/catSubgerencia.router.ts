import CatSubgerenciaController from '../controllers/catSubgerencia.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catSubgerenciaRouter = Router()
const catSubgerenciaController = new CatSubgerenciaController()

catSubgerenciaRouter.post('/', AuthMiddleware.autetication, catSubgerenciaController.createCatSubgerencia.bind(catSubgerenciaController))
catSubgerenciaRouter.get('/', AuthMiddleware.autetication, catSubgerenciaController.getCatSubgerencias.bind(catSubgerenciaController))
catSubgerenciaRouter.post('/update/:uuid', AuthMiddleware.autetication, catSubgerenciaController.updateCatSubgerencia.bind(catSubgerenciaController))

export default catSubgerenciaRouter;
