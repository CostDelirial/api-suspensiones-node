import { CatGerenciaDAO } from '../daos/catGerencia.dao';
import ICatGerencia from '../interfaces/catGerencia.interface';
import logger from '../../lib/logger';

export class CatGerenciaService {
  static async createCatGerencia(body: ICatGerencia) {
    try {
      
      const newGerencia = await CatGerenciaDAO.create(body);
      return {
        ok: true,
        message: 'Gerencia creada exitosamente',
        response: newGerencia,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catGerencia/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear la gerencia',
        code: 500
      };
    }
  }

  static async updateCatGerencia(id: string, body: ICatGerencia) {
  try {
    console.log("Actualizando ducto ID:", id, "Body:", body);

    const ductoActual = await CatGerenciaDAO.findById(id);
    if (!ductoActual) {
      return {
        ok: false,
        message: 'El ducto no existe.',
        code: 404
      };
    }

    // Validar name duplicado solo si cambia
    if (body.name && body.name !== ductoActual.name) {
      const exists = await CatGerenciaDAO.findByName(body.name);
      if (exists) {
        return {
          ok: false,
          message: `La gerencia ${body.name} ya está registrado.`,
          code: 409
        };
      }
    }

    const updatedGerencia = await CatGerenciaDAO.update(id, body);

    return {
      ok: true,
      message: 'Actualizado correctamente',
      response: updatedGerencia,
      code: 200
    };

  } catch (error) {
    logger.error(`[service/catGerencia/update]: ${error}`);
    return {
      ok: false,
      message: 'Error interno al actualizar',
      code: 500
    };
  }
}

  static async getCatGerencias() {
    try {
      console.log("2")
      const gerencias = await CatGerenciaDAO.findAll();
      return {
        ok: true,
        message: 'Gerencias obtenidas',
        response: gerencias,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catGerencia/getAll]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener gerencias',
        code: 500
      };
    }
  }

  static async getCatGerencia(id: string) {
    try {
      const gerencia = await CatGerenciaDAO.findById(id);
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
      logger.error(`[service/catGerencia/getById]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener la gerencia',
        code: 500
      };
    }
  }
}