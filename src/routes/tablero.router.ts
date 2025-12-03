import TableroController from '../controllers/tablero.controller';
import AuthMiddleware from '../middlewares/authenticate.middleware';
import { Router, Request, Response } from "express";

const tableroRouter = Router()
const tableroController = new TableroController()

tableroRouter.post('/', AuthMiddleware.autetication, tableroController.createTablero.bind(tableroController))
tableroRouter.get('/', tableroController.getTableros.bind(tableroController))
tableroRouter.get('/principal', AuthMiddleware.autetication, tableroController.tableroPrincipal.bind(tableroController))
tableroRouter.get('/historico/:uuid_ducto', AuthMiddleware.autetication, tableroController.historicoByDucto.bind(tableroController))

export default tableroRouter;
