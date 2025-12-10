import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { TableroService } from "../services/tablero.service";
import JWTUtil from "../utils/jwt.util";
import { decode } from "punycode";
import UserService from "../services/user.service";


export default class TableroController {

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
                logger.error(`[Error/controller/historicoByDucto]: ${error}`);
                return ResponseHelper.error(res, 'Internal Server Error', null, 500);
            }
    }

    async create(req: Request, res: Response) {
        try {
            console.log("AQUI: ",req.body)
            req.body.usuarioCreacion = req.body.user_client.payload.ficha
            const result = await TableroService.createRegistro(req.body);
            return res.status(result.code).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

}