import { CatMotivoDAO } from '../daos/catMotivo.dao';
import ICatMotivo from '../interfaces/catMotivo.interface';
import logger from '../../lib/logger';

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

  static async updateCatMotivo(id: string, body: ICatMotivo) {
  try {
    console.log("Actualizando ducto ID:", id, "Body:", body);

    const ductoActual = await CatMotivoDAO.findById(id);
    if (!ductoActual) {
      return {
        ok: false,
        message: 'El motivo no existe.',
        code: 404
      };
    }

    // Validar nombre duplicado solo si cambia
    if (body.name && body.name !== ductoActual.name) {
      const exists = await CatMotivoDAO.findByName(body.name);
      if (exists) {
        return {
          ok: false,
          message: `El ducto ${body.name} ya está registrado.`,
          code: 409
        };
      }
    }

    const updatedMotivo = await CatMotivoDAO.update(id, body);

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