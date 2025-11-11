import { CatMotivoDAO } from '../daos/catMotivo.dao';
import ICatMotivo from '../interfaces/catMotivo.interface';
import logger from '../../lib/logger';

export class CatMotivoService {
  static async createCatMotivo(body: ICatMotivo) {
    try {
      console.log("Va a buscar si existe lo que intenta ingresar: ", body)
      const exists = await CatMotivoDAO.findByName(body.nombre);
      console.log("exists: ", exists)
      if (exists) {
        return {
          ok: false,
          message: `El nivel ${body.nombre} ya está registrado.`,
          code: 409
        };
      }
console.log("pasoo: ", body)
      const newMotivo = await CatMotivoDAO.create(body);
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
      console.log("Va a leer todos los motivos")
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

  static async updateMotivo(motivo: ICatMotivo) {
    try {
      const updated = await CatMotivoDAO.update(motivo);
      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catMotivo/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar',
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