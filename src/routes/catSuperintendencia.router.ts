import CatSuperintendenciaController from '../controllers/catSuperintendencia.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catSuperintendenciaRouter = Router()
const catSuperintendenciaController = new CatSuperintendenciaController()

catSuperintendenciaRouter.post('/', AuthMiddleware.autetication, catSuperintendenciaController.createCatSuperintendencia.bind(catSuperintendenciaController))
catSuperintendenciaRouter.get('/', AuthMiddleware.autetication, catSuperintendenciaController.getCatSuperintendencias.bind(catSuperintendenciaController))
catSuperintendenciaRouter.post('/update/:uuid', AuthMiddleware.autetication, catSuperintendenciaController.updateCatSuperintendencia.bind(catSuperintendenciaController))

export default catSuperintendenciaRouter;
