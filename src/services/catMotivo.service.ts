import { CatMotivoDAO } from '../daos/catMotivo.dao';
import ICatMotivo from '../interfaces/catMotivo.interface';
import logger from '../../lib/logger';
import HttpServer from '../../config/server.config'; // <-- importamos el servidor con io

export class CatMotivoService {
  static async createCatMotivo(body: ICatMotivo) {
    try {
      const exists = await CatMotivoDAO.findByName(body.name);
      if (exists) {
        return {
          ok: false,
          message: `El motivo ${body.name} ya está registrado.`,
          code: 409
        };
      }

      const newMotivo = await CatMotivoDAO.create(body);

     HttpServer.instance.io.emit('catMotivo_created', newMotivo);

      return {
        ok: true,
        message: 'Creado correctamente',
        response: newMotivo,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catMotivo/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear',
        code: 500
      };
    }
  }

  static async getCatMotivos() {
    try {
      const motivos = await CatMotivoDAO.findAll();
      return {
        ok: true,
        message: 'Lista obtenida',
        response: motivos,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catMotivo/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener motivos',
        code: 500
      };
    }
  }

  static async updateCatMotivo(id: string, body: ICatMotivo) {
    try {
      const motivoActual = await CatMotivoDAO.findById(id);
      if (!motivoActual) {
        return {
          ok: false,
          message: 'El motivo no existe.',
          code: 404
        };
      }

      // Validar name duplicado solo si cambia
      if (body.name && body.name !== motivoActual.name) {
        const exists = await CatMotivoDAO.findByName(body.name);
        if (exists) {
          return {
            ok: false,
            message: `El motivo ${body.name} ya está registrado.`,
            code: 409
          };
        }
      }

      const updatedMotivo = await CatMotivoDAO.update(id, body);

      HttpServer.instance.io.emit('catMotivo_updated', updatedMotivo);

      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updatedMotivo,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catMotivo/update]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al actualizar',
        code: 500
      };
    }
  }

  static async getCatMotivo(id: string) {
    try {
      const motivo = await CatMotivoDAO.findById(id);
      return {
        ok: true,
        message: 'Motivo encontrado',
        response: motivo,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catMotivo/findById]: ${error}`);
      return {
        ok: false,
        message: 'Error al buscar el motivo',
        code: 500
      };
    }
  }
}