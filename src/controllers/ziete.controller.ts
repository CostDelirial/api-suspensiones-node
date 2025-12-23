import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { ZieteService } from "../services/ziete.service";
import JWTUtil from "../utils/jwt.util";
import UserService from "../services/user.service";

export default class ZieteController {

   
    async getGeneral(req: Request, res: Response): Promise<any> {
        try {
            console.log("fechas recibidas: ", req.body)
            const response = await ZieteService.getGeneral(req.body);
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });
        } catch (error) {
            logger.error(`[Error/controller/getZietes]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
async getParticular(req: Request, res: Response): Promise<any> {
        try {
            console.log("body recibido: ", req.body)
            const response = await ZieteService.getParticular(req.body);
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });
        } catch (error) {
            logger.error(`[Error/controller/getZietes]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getTimeline(req: Request, res: Response) {
    try {
      console.log("body recibido: ", req.body)

      if (!req.body.uuidDucto || !req.body.fini || !req.body.ffin) {
        return ResponseHelper.error(
          res,
          'Parámetros incompletos',
          400
        );
      }

      const result = await ZieteService.getTimeline(
        req.body.uuidDucto,
        req.body.fini,
        req.body.ffin
      );

      if (!result.ok) {
        return ResponseHelper.error(
          res,
          result.message,
          result.code
        );
      }

      return ResponseHelper.success(
        res,
        result.message,
        result.response,
        result.code
      );

    } catch (error) {
      return ResponseHelper.error(
        res,
        'Error interno',
        500
      );
    }
  }
   
}