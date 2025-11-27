import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatSemaforoService } from "../services/catSemaforo.service";
import JWTUtil from "../utils/jwt.util";
import UserService from "../services/user.service";

export default class CatSemaforoController {

    async createCatSemaforo(req: Request, res: Response): Promise<any> {
        try {
            req.body.usuarioCreacion = req.body.user_client.user.ficha
            const response = await CatSemaforoService.createCatSemaforo(req.body);
            if (!response.ok) {
                return res.status(400).json({
                    ok: false,
                    message: response.message,
                    response: null,
                    code: 400
                }
                )
            }
            return res.status(201).json({
                ok: true,
                message: 'Creado correctamente.',
                response: response.response,
                code: 201
            });

        } catch (error) {
            logger.error(`[Error/controller/createCatSemaforo]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getCatSemaforos(req: Request, res: Response): Promise<any> {
        try {
            const response = await CatSemaforoService.getCatSemaforos();
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });
        } catch (error) {
            logger.error(`[Error/controller/getCatSemaforos]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async delete(req: Request, res: Response): Promise<any> {
        try {
            const { _id } = req.body;
            const token = req.headers.authorization;

            if (!_id || !token) {
                return ResponseHelper.error(res, 'Missing ID or token', null, 400);
            }

            const jwtUtil = new JWTUtil();
            const userService = new UserService();

            const user = await jwtUtil.decodeToken(token) as any;
            const infoUser = await userService.getUserById(user.id);
            const infoSemaforo = await CatSemaforoService.getCatSemaforo(_id) as any;

            infoSemaforo.status = infoSemaforo.status === 'inactive' ? 'active' : 'inactive';
            infoSemaforo.fechaActualizacion = new Date();
            if (infoUser != null)
                infoSemaforo.usuarioActualizacion = infoUser.ficha;

            const updated = await CatSemaforoService.updateSemaforo(infoSemaforo);

            return ResponseHelper.success(res, 'Semaforo updated successfully', updated, 200);
        } catch (error) {
            logger.error(`[Error/controller/deleteCatSemaforo]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
}