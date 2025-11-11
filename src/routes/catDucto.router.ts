import CatDuctoController from '../controllers/catDucto.controller';
import { Router, Request, Response } from "express";

const catDuctoRouter = Router()
const catDuctoController = new CatDuctoController()

catDuctoRouter.post('/', catDuctoController.createCatDucto.bind(catDuctoController))
catDuctoRouter.get('/', catDuctoController.getCatDuctos.bind(catDuctoController))
catDuctoRouter.post('/delete', catDuctoController.delete.bind(catDuctoController))

export default catDuctoRouter;
