import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { TableroService } from "../services/tablero.service";
import JWTUtil from "../utils/jwt.util";
import { decode } from "punycode";
import UserService from "../services/user.service";


export default class TableroController {

    async createTablero(req: Request, res: Response): Promise<any> {
        try {
            req.body.usuarioCreacion = req.body.user_client.user.ficha
            const response = await TableroService.createTablero(req.body);
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
                message: response.message,
                response: response.response,
                code: 201
            });
        } catch (error) {
            logger.error(`[Error/controller/createTablero]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getTableros(req: Request, res: Response): Promise<any> {
        try {
            const result = await TableroService.getAll();
            return ResponseHelper.success(res, result.message, result.response, result.code);
        } catch (error) {
            logger.error(`[Error/controller/getTableros]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async tableroPrincipal(req: Request, res: Response): Promise<any> {
            try {
                const response = await TableroService.tableroPrincipal();
                return res.status(200).json({
                    ok: true,
                    message: 'Datos obtenidos correctamente.',
                    response: response.response,
                    code: 200
                });
            } catch (error) {
                logger.error(`[Error/controller/tableroPrincipal]: ${error}`);
                return ResponseHelper.error(res, 'Internal Server Error', null, 500);
            }
        }

    async historicoByDucto(req: Request, res: Response): Promise<Response> {
        try {
            console.log("req.params: ", req.params)
            const { uuid_ducto } = req.params;
            console.log("uuid_ducto: ", uuid_ducto)
            if (uuid_ducto == null) {
                console.log("sin ducto")
                return ResponseHelper.error(res, "sin ducto", null, 500);
            }
            const result = await TableroService.historicoByDucto(uuid_ducto);
            return res.status(200).json({
                    ok: true,
                    message: 'Datos obtenidos correctamente.',
                    response: result.response,
                    code: 200
                });
            } catch (error) {
                logger.error(`[Error/controller/tableroPrincipal]: ${error}`);
                return ResponseHelper.error(res, 'Internal Server Error', null, 500);
            }
    }

    async create(req: Request, res: Response) {
        try {
            req.body.usuarioCreacion = req.body.user_client.user.ficha
            const result = await TableroService.createRegistro(req.body);
            return res.status(result.code).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

}