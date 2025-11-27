import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatGerenciaService } from "../services/catGerencia.service";
import UserService from "../services/user.service";
import JWTUtil from "../utils/jwt.util";

export default class CatGerenciaController {

  async createCatGerencia(req: Request, res: Response): Promise<any> {
    try {
      req.body.usuarioCreacion = req.body.user_client.user.ficha
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
        message: 'Creado correctamente la gerencia: ' + response.response?.nombre,
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

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body;
      const token = req.headers.authorization;

      if (!token || !id) {
        return ResponseHelper.error(res, 'Token o ID faltante', null, 400);
      }

      const jwtUtil = new JWTUtil();
      const userService = new UserService();
      const decoded = await jwtUtil.decodeToken(token) as any;

      const infoUser = await userService.getUserByFicha(decoded.id); //cambiar despues por busqueda por id
      const gerenciaResult = await CatGerenciaService.getCatGerencia(id);

      if (!gerenciaResult.ok || !gerenciaResult.response) {
        return ResponseHelper.error(res, 'Gerencia no encontrada', null, 404);
      }

      const gerencia = gerenciaResult.response;
      gerencia.estatus = gerencia.estatus === false ? true : false;
      gerencia.fechaModificacion = new Date();
      if (infoUser != null)
        gerencia.usuarioModificacion = infoUser.ficha.toString();

      const updateResult = await CatGerenciaService.update(gerencia);

      return ResponseHelper.success(res, 'Gerencia actualizada', updateResult.response, updateResult.code);
    } catch (error) {
      logger.error(`[controller/catGerencia/delete]: ${error}`);
      return ResponseHelper.error(res, 'Error al eliminar gerencia', null, 500);
    }
  }
}