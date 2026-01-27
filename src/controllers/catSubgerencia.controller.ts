import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatSubgerenciaService } from "../services/catSubgerencia.service";
import UserService from "../services/user.service";
import JWTUtil from "../utils/jwt.util";

export default class CatSubgerenciaController {

  async createCatSubgerencia(req: Request, res: Response): Promise<any> {
    try {
      req.body.usuarioCreacion = req.body.user_client.payload.ficha
      const response = await CatSubgerenciaService.createCatSubgerencia(req.body);
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
      logger.error(`[controller/catSubgerencia/create]: ${error}`);
      return ResponseHelper.error(res, 'Error al crear gerencia', null, 500);
    }
  }

  async getCatSubgerencias(req: Request, res: Response): Promise<any> {
    try {
      const response = await CatSubgerenciaService.getCatSubgerencias();
      return res.status(200).json({
        ok: true,
        message: 'Datos obtenidos correctamente.',
        response: response.response,
        code: 200
      });
    } catch (error) {
      logger.error(`[controller/catSubgerencia/getAll]: ${error}`);
      return ResponseHelper.error(res, 'Error al obtener subgerencias', null, 500);
    }
  }

  async updateCatSubgerencia(req: Request, res: Response): Promise<any> {
    try {
      const { uuid } = req.params;

      req.body.usuarioModificacion = req.body.user_client.payload.ficha;

      const response = await CatSubgerenciaService.updateCatSubgerencia(uuid, req.body);

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
      logger.error(`[Error/controller/updateCatSubgerencia]: ${error}`);
      return ResponseHelper.error(res, 'Internal Server Error', null, 500);
    }
  }

}