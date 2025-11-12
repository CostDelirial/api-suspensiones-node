import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatDuctoService } from "../services/catDucto.service";
import JWTUtil from "../utils/jwt.util";
import  UserService  from "../services/user.service";

export default class CatDuctoController {

    async createCatDucto(req: Request, res: Response): Promise<any> {
        try {
            console.log("body enviado: ", req.body)
            if (!req.body) {
                return ResponseHelper.error(res, 'No data received', null, 400);
            }
            const token = req.headers.authorization;
            const jwt = new JWTUtil();
            const cleanToken = token!.replace(/^Bearer\s+/i, "");
            const decoded = await jwt.decodeToken(cleanToken as string) as any;
            console.log("decode: ", decoded)
            req.body.usuarioCreacion = decoded.user.ficha
           
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
            return ResponseHelper.success(res, 'Fetched puestos successfully', response, 200);
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