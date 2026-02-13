import { CatDuctoDAO } from '../daos/catDucto.dao';
import ICatDucto from '../interfaces/catDucto.interface';
import logger from '../../lib/logger';

export class CatDuctoService {
  static async createCatDucto(body: ICatDucto) {
    try {
      const exists = await CatDuctoDAO.findByName(body.name);
      if (exists) {
        return {
          ok: false,
          message: `El nivel ${body.name} ya está registrado.`,
          code: 409
        };
      }
      const newDucto = await CatDuctoDAO.create(body);
      return {
        ok: true,
        message: 'Creado correctamente',
        response: newDucto,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catDucto/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear',
        code: 500
      };
    }
  }

  static async getCatDuctos() {
    try {
      console.log("Va a leer todos los ductos")
      const ductos = await CatDuctoDAO.findAll();
      return {
        ok: true,
        message: 'Lista obtenida',
        response: ductos,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catDucto/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener ductos',
        code: 500
      };
    }
  }

  static async updateCatDucto(id: string, body: ICatDucto) {
    try {
      console.log("Actualizando ducto ID:", id, "Body:", body);

      const ductoActual = await CatDuctoDAO.findById(id);
      if (!ductoActual) {
        return {
          ok: false,
          message: 'El ducto no existe.',
          code: 404
        };
      }

      // Validar name duplicado solo si cambia
      if (body.name && body.name !== ductoActual.name) {
        const exists = await CatDuctoDAO.findByName(body.name);
        if (exists) {
          return {
            ok: false,
            message: `El ducto ${body.name} ya está registrado.`,
            code: 409
          };
        }
      }

      const updatedDucto = await CatDuctoDAO.update(id, body);

      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updatedDucto,
        code: 200
      };

    } catch (error) {
      logger.error(`[service/catDucto/update]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al actualizar',
        code: 500
      };
    }
  }

  static async getCatDucto(id: string) {
    try {
      const ducto = await CatDuctoDAO.findById(id);
      return {
        ok: true,
        message: 'Ducto encontrado',
        response: ducto,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catDucto/findById]: ${error}`);
      return {
        ok: false,
        message: 'Error al buscar el ducto',
        code: 500
      };
    }
  }
}