import { CatSuperintendenciaDAO } from '../daos/catSuperintendencia.dao';
import IcatSuperintendencia from '../interfaces/catSuperintendencia.interface';
import logger from '../../lib/logger';

export class CatSuperintendenciaService {
  static async createCatSuperintendencia(body: IcatSuperintendencia) {
    try {
      const newGerencia = await CatSuperintendenciaDAO.create(body);
      return {
        ok: true,
        message: 'Gerencia creada exitosamente',
        response: newGerencia,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catSuperintendencia/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear la gerencia',
        code: 500
      };
    }
  }

  
static async updateCatSuperintendencia(id: string, body: IcatSuperintendencia) {
  try {
    console.log("Actualizando superintendencia ID:", id, "Body:", body);

    const superintendenciaActual = await CatSuperintendenciaDAO.findById(id);
    if (!superintendenciaActual) {
      return {
        ok: false,
        message: 'El superintendencia no existe.',
        code: 404
      };
    }

    // Validar nombre duplicado solo si cambia
    if (body.name && body.name !== superintendenciaActual.name) {
      const exists = await CatSuperintendenciaDAO.findByName(body.name);
      if (exists) {
        return {
          ok: false,
          message: `El superintendencia ${body.name} ya está registrado.`,
          code: 409
        };
      }
    }

    const updatedSuperintendencia = await CatSuperintendenciaDAO.update(id, body);

    return {
      ok: true,
      message: 'Actualizado correctamente',
      response: updatedSuperintendencia,
      code: 200
    };

  } catch (error) {
    logger.error(`[service/catSuperintendencia/update]: ${error}`);
    return {
      ok: false,
      message: 'Error interno al actualizar',
      code: 500
    };
  }
}

  static async getCatSuperintendencias() {
    try {
      const gerencias = await CatSuperintendenciaDAO.findAll();
      return {
        ok: true,
        message: 'Gerencias obtenidas',
        response: gerencias,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSuperintendencia/getAll]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener gerencias',
        code: 500
      };
    }
  }

  static async getCatSuperintendencia(id: string) {
    try {
      const gerencia = await CatSuperintendenciaDAO.findById(id);
      if (!gerencia) {
        return {
          ok: false,
          message: 'Gerencia no encontrada',
          code: 404
        };
      }

      return {
        ok: true,
        message: 'Gerencia encontrada',
        response: gerencia,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSuperintendencia/getById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener la gerencia',
        code: 500
      };
    }
  }
}