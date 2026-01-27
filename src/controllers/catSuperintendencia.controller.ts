import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatSuperintendenciaService } from "../services/catSuperintendencia.service";
import UserService from "../services/user.service";
import JWTUtil from "../utils/jwt.util";

export default class CatSuperintendenciaController {

  async createCatSuperintendencia(req: Request, res: Response): Promise<any> {
    try {
      req.body.usuarioCreacion = req.body.user_client.payload.ficha
      const response = await CatSuperintendenciaService.createCatSuperintendencia(req.body);
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
      logger.error(`[controller/catSuperintendencia/create]: ${error}`);
      return ResponseHelper.error(res, 'Error al crear gerencia', null, 500);
    }
  }

  async getCatSuperintendencias(req: Request, res: Response): Promise<any> {
    try {
      const response = await CatSuperintendenciaService.getCatSuperintendencias();
      return res.status(200).json({
        ok: true,
        message: 'Datos obtenidos correctamente.',
        response: response.response,
        code: 200
      });
    } catch (error) {
      logger.error(`[controller/catSuperintendencia/getAll]: ${error}`);
      return ResponseHelper.error(res, 'Error al obtener Superintendencia', null, 500);
    }
  }

  async updateCatSuperintendencia(req: Request, res: Response): Promise<any> {
  try {
    const { uuid } = req.params;

    req.body.usuarioModificacion = req.body.user_client.payload.ficha;

    const response = await CatSuperintendenciaService.updateCatSuperintendencia(uuid, req.body);

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
      message: 'Actualizado correctamente el Superintendencia: ' + response.response?.nombre,
      response: response.response,
      code: 200
    });

  } catch (error) {
    logger.error(`[Error/controller/updateCatSuperintendencia]: ${error}`);
    return ResponseHelper.error(res, 'Internal Server Error', null, 500);
  }
}
  
}