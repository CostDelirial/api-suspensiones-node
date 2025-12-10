import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatPuestoService } from "../services/catPuesto.service";
import JWTUtil from "../utils/jwt.util";
import UserService from "../services/user.service";

export default class CatPuestoController {

    async createCatPuesto(req: Request, res: Response): Promise<any> {
        try {
            req.body.usuarioCreacion = req.body.user_client.payload.ficha
            const response = await CatPuestoService.createCatPuesto(req.body);
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
                message: 'Creado correctamente el puesto: ' + response.response?.nombre,
                response: response.response,
                code: 201
            });

        } catch (error) {
            logger.error(`[Error/controller/createCatPuesto]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getCatPuestos(req: Request, res: Response): Promise<any> {
        try {
            const response = await CatPuestoService.getCatPuestos();
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });
        } catch (error) {
            logger.error(`[Error/controller/getCatPuestos]: ${error}`);
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
            const infoPuesto = await CatPuestoService.getCatPuesto(_id) as any;

            infoPuesto.status = infoPuesto.status === 'inactive' ? 'active' : 'inactive';
            infoPuesto.fechaActualizacion = new Date();
            if (infoUser != null)
                infoPuesto.usuarioActualizacion = infoUser.ficha;

            const updated = await CatPuestoService.updatePuesto(infoPuesto);

            return ResponseHelper.success(res, 'Puesto updated successfully', updated, 200);
        } catch (error) {
            logger.error(`[Error/controller/deleteCatPuesto]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
}