import ZieteController from '../controllers/ziete.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const zieteRouter = Router()
const zieteController = new ZieteController()

zieteRouter.post('/general', AuthMiddleware.autetication, zieteController.getGeneral.bind(zieteController))
zieteRouter.post('/particular', AuthMiddleware.autetication, zieteController.getParticular.bind(zieteController))
zieteRouter.post('/timeLine', AuthMiddleware.autetication, zieteController.getTimeline.bind(zieteController))


export default zieteRouter;