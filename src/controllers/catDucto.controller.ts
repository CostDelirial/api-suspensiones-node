import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatDuctoService } from "../services/catDucto.service";
import JWTUtil from "../utils/jwt.util";
import UserService from "../services/user.service";

export default class CatDuctoController {

    async createCatDucto(req: Request, res: Response): Promise<any> {
        try {
            req.body.usuarioCreacion = req.body.user_client.payload.ficha
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
                message: 'Creado correctamente el ducto: ' + response.response?.name,
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

    async updateCatDucto(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;

    req.body.usuarioModificacion = req.body.user_client.payload.ficha;

    const response = await CatDuctoService.updateCatDucto(id, req.body);

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
    logger.error(`[Error/controller/updateCatDucto]: ${error}`);
    return ResponseHelper.error(res, 'Internal Server Error', null, 500);
  }
}
    
}