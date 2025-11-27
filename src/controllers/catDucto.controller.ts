import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatDuctoService } from "../services/catDucto.service";
import JWTUtil from "../utils/jwt.util";
import UserService from "../services/user.service";

export default class CatDuctoController {

    async createCatDucto(req: Request, res: Response): Promise<any> {
        try {
            req.body.usuarioCreacion = req.body.user_client.user.ficha
            const response = await CatDuctoService.createCatDucto(req.body);
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
                message: 'Creado correctamente el ducto: ' + response.response?.nombre,
                response: response.response,
                code: 201
            });

        } catch (error) {
            logger.error(`[Error/controller/createCatDucto]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getCatDuctos(req: Request, res: Response): Promise<any> {
        try {
            const response = await CatDuctoService.getCatDuctos();
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });

        } catch (error) {
            logger.error(`[Error/controller/getCatDuctos]: ${error}`);
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
            const infoDucto = await CatDuctoService.getCatDucto(_id) as any;

            infoDucto.status = infoDucto.status === 'inactive' ? 'active' : 'inactive';
            infoDucto.fechaActualizacion = new Date();
            if (infoUser != null)
                infoDucto.usuarioActualizacion = infoUser.ficha;

            const updated = await CatDuctoService.updateDucto(infoDucto);

            return ResponseHelper.success(res, 'Ducto updated successfully', updated, 200);
        } catch (error) {
            logger.error(`[Error/controller/deleteCatDucto]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
}