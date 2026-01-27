import CatMotivoController from '../controllers/catMotivo.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catMotivoRouter = Router()
const catMotivoController = new CatMotivoController()

catMotivoRouter.post('/', AuthMiddleware.autetication, catMotivoController.createCatMotivo.bind(catMotivoController))
catMotivoRouter.get('/', AuthMiddleware.autetication, catMotivoController.getCatMotivos.bind(catMotivoController))
catMotivoRouter.post('/update/:uuid', AuthMiddleware.autetication, catMotivoController.updateCatMotivo.bind(catMotivoController))

export default catMotivoRouter;
