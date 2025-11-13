import TableroController from '../controllers/tablero.controller';
import { Router, Request, Response } from "express";

const tableroRouter = Router()
const tableroController = new TableroController()

tableroRouter.post('/', tableroController.createTablero.bind(tableroController))
tableroRouter.get('/', tableroController.getTableros.bind(tableroController))
tableroRouter.get('/principal', tableroController.tableroPrincipal.bind(tableroController))

export default tableroRouter;
