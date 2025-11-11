import CatMotivoController from '../controllers/catMotivo.controller';
import { Router, Request, Response } from "express";

const catMotivoRouter = Router()
const catMotivoController = new CatMotivoController()

catMotivoRouter.post('/', catMotivoController.createCatMotivo.bind(catMotivoController))
catMotivoRouter.get('/', catMotivoController.getCatMotivos.bind(catMotivoController))
catMotivoRouter.post('/delete', catMotivoController.delete.bind(catMotivoController))

export default catMotivoRouter;
