import CatGerenciaController from '../controllers/catGerencia.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catGerenciaRouter = Router()
const catGerenciaController = new CatGerenciaController()

catGerenciaRouter.post('/', AuthMiddleware.autetication, catGerenciaController.createCatGerencia.bind(catGerenciaController))
catGerenciaRouter.get('/', AuthMiddleware.autetication, catGerenciaController.getCatGerencias.bind(catGerenciaController))
catGerenciaRouter.post('/delete', catGerenciaController.delete.bind(catGerenciaController))

export default catGerenciaRouter;
