import CatSemaforoController from '../controllers/catSemaforo.controller';
import { Router, Request, Response } from "express";

const catSemaforoRouter = Router()
const catSemaforoController = new CatSemaforoController()

catSemaforoRouter.post('/', catSemaforoController.createCatSemaforo.bind(catSemaforoController))
catSemaforoRouter.get('/', catSemaforoController.getCatSemaforos.bind(catSemaforoController))
catSemaforoRouter.post('/delete', catSemaforoController.delete.bind(catSemaforoController))

export default catSemaforoRouter;
