import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { TableroService } from "../services/tablero.service";
import JWTUtil from "../utils/jwt.util";

export default class TableroController {

    async createTablero(req: Request, res: Response): Promise<any> {
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
                message: 'Creado correctamente el tablero: ' + response.response?.nombre,
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
            const response = await TableroService.getAll();
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });
        } catch (error) {
            logger.error(`[Error/controller/getTableros]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async tableroPrincipal(req: Request, res: Response): Promise<Response> {
    try {
      const result = await TableroService.tableroPrincipal();

      if (!result.ok) {
        return ResponseHelper.error(res, result.message, null, result.code);
      }

      return ResponseHelper.success(res, result.message, result.response, result.code);
    } catch (error) {
      logger.error(`[controller/tablero/tableroPrincipal]: ${error}`);
      return ResponseHelper.error(res, "Error al obtener tablero principal", null, 500);
    }
  }
}