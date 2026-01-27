import CatSemaforoController from '../controllers/catSemaforo.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catSemaforoRouter = Router()
const catSemaforoController = new CatSemaforoController()

catSemaforoRouter.post('/', AuthMiddleware.autetication, catSemaforoController.createCatSemaforo.bind(catSemaforoController))
catSemaforoRouter.get('/', AuthMiddleware.autetication, catSemaforoController.getCatSemaforos.bind(catSemaforoController))
catSemaforoRouter.post('/update/:uuid', AuthMiddleware.autetication, catSemaforoController.updateCatSemaforo.bind(catSemaforoController))

export default catSemaforoRouter;
