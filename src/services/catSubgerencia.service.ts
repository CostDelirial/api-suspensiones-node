import { CatSubgerenciaDAO } from '../daos/catSubgerencia.dao';
import IcatSubgerencia from '../interfaces/catSubgerencia.interface';
import logger from '../../lib/logger';

export class CatSubgerenciaService {
  static async createCatSubgerencia(body: IcatSubgerencia) {
    try {
      const newGerencia = await CatSubgerenciaDAO.create(body);
      return {
        ok: true,
        message: 'Subgerencia creada exitosamente',
        response: newGerencia,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catSubgerencia/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear la gerencia',
        code: 500
      };
    }
  }

  static async updateCatSubgerencia(id: string, body: IcatSubgerencia) {
  try {
    console.log("Actualizando Subgerencia ID:", id, "Body:", body);

    const subgerenciaActual = await CatSubgerenciaDAO.findById(id);
    if (!subgerenciaActual) {
      return {
        ok: false,
        message: 'El Subgerencia no existe.',
        code: 404
      };
    }

    // Validar name duplicado solo si cambia
    if (body.name && body.name !== subgerenciaActual.name) {
      const exists = await CatSubgerenciaDAO.findByName(body.name);
      if (exists) {
        return {
          ok: false,
          message: `El Subgerencia ${body.name} ya está registrado.`,
          code: 409
        };
      }
    }

    const updatedSubgerencia = await CatSubgerenciaDAO.update(id, body);

    return {
      ok: true,
      message: 'Actualizado correctamente',
      response: updatedSubgerencia,
      code: 200
    };

  } catch (error) {
    logger.error(`[service/catSubgerencia/update]: ${error}`);
    return {
      ok: false,
      message: 'Error interno al actualizar',
      code: 500
    };
  }
}

  static async getCatSubgerencias() {
    try {
      const gerencias = await CatSubgerenciaDAO.findAll();
      return {
        ok: true,
        message: 'Subgerencias obtenidas',
        response: gerencias,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSubgerencia/getAll]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener subgerencias',
        code: 500
      };
    }
  }

  static async getCatSubgerencia(id: string) {
    try {
      const gerencia = await CatSubgerenciaDAO.findById(id);
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
      logger.error(`[service/catSubgerencia/getById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener la gerencia',
        code: 500
      };
    }
  }
}