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
                message: 'Creado correctamente el puesto: ' + response.response?.name,
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

    async updateCatPuesto(req: Request, res: Response): Promise<any> {
        try {
            const { uuid } = req.params;

            req.body.usuarioModificacion = req.body.user_client.payload.ficha;

            const response = await CatPuestoService.updateCatPuesto(uuid, req.body);

            if (!response.ok) {
                return res.status(response.code || 400).json({
                    ok: false,
                    message: response.message,
                    response: null,
                    code: response.code || 400
                });
            }

            return res.status(200).json({
                ok: true,
                message: 'Actualizado correctamente el ducto: ' + response.response?.nombre,
                response: response.response,
                code: 200
            });

        } catch (error) {
            logger.error(`[Error/controller/updateCatPuesto]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

}