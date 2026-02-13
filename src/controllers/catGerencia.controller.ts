import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatGerenciaService } from "../services/catGerencia.service";
import UserService from "../services/user.service";
import JWTUtil from "../utils/jwt.util";

export default class CatGerenciaController {

  async createCatGerencia(req: Request, res: Response): Promise<any> {
    try {
      req.body.usuarioCreacion = req.body.user_client.payload.ficha
      const response = await CatGerenciaService.createCatGerencia(req.body);
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
        message: 'Creado correctamente la gerencia: ' + response.response?.name,
        response: response.response,
        code: 201
      });
    } catch (error) {
      logger.error(`[controller/catGerencia/create]: ${error}`);
      return ResponseHelper.error(res, 'Error al crear gerencia', null, 500);
    }
  }

  async getCatGerencias(req: Request, res: Response): Promise<any> {
    try {
      const response = await CatGerenciaService.getCatGerencias();
      return res.status(200).json({
        ok: true,
        message: 'Datos obtenidos correctamente.',
        response: response.response,
        code: 200
      });
    } catch (error) {
      logger.error(`[controller/catGerencia/getAll]: ${error}`);
      return ResponseHelper.error(res, 'Error al obtener gerencias', null, 500);
    }
  }

 async updateCatGerencia(req: Request, res: Response): Promise<any> {
  try {
    const { uuid } = req.params;

    req.body.usuarioModificacion = req.body.user_client.payload.ficha;

    const response = await CatGerenciaService.updateCatGerencia(uuid, req.body);

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
      message: 'Actualizado correctamente la gerencia: ' + response.response?.name,
      response: response.response,
      code: 200
    });

  } catch (error) {
    logger.error(`[Error/controller/updateCatGerencia]: ${error}`);
    return ResponseHelper.error(res, 'Internal Server Error', null, 500);
  }
}
}