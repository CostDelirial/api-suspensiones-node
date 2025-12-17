import ZieteController from '../controllers/ziete.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const zieteRouter = Router()
const zieteController = new ZieteController()

zieteRouter.get('/general', AuthMiddleware.autetication, zieteController.getGeneral.bind(zieteController))
zieteRouter.get('/particular/:uuid_ducto/:fecha_ini/:fecha_fin', AuthMiddleware.autetication, zieteController.getParticular.bind(zieteController))

export default zieteRouter;