import CatDuctoController from '../controllers/catDucto.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const catDuctoRouter = Router()
const catDuctoController = new CatDuctoController()

catDuctoRouter.post('/', AuthMiddleware.autetication, catDuctoController.createCatDucto.bind(catDuctoController))
catDuctoRouter.get('/', AuthMiddleware.autetication, catDuctoController.getCatDuctos.bind(catDuctoController))
catDuctoRouter.post('/delete', catDuctoController.delete.bind(catDuctoController))

export default catDuctoRouter;
