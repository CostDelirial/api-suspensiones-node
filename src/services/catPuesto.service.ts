import { CatPuestoDAO } from '../daos/catPuesto.dao';
import ICatPuesto from '../interfaces/catPuesto.interface';
import logger from '../../lib/logger';

export class CatPuestoService {
  static async createCatPuesto(body: ICatPuesto) {
    try {
      console.log("Va a buscar si existe lo que intenta ingresar: ", body)
      const exists = await CatPuestoDAO.findByNivelName(body.nivel, body.nombre);
      console.log("exists: ", exists)
      if (exists) {
        return {
          ok: false,
          message: `El nivel ${body.nivel} ya está registrado.`,
          code: 400
        };
      }
console.log("pasoo: ", body)
      const newPuesto = await CatPuestoDAO.create(body);
      return {
        ok: true,
        message: 'Creado correctamente',
        response: newPuesto,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catPuesto/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear',
        code: 500
      };
    }
  }

  static async getCatPuestos() {
    try {
      console.log("Va a leer todos los puestos")
      const puestos = await CatPuestoDAO.findAll();
      return {
        ok: true,
        message: 'Lista obtenida',
        response: puestos,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catPuesto/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener puestos',
        code: 500
      };
    }
  }

  static async updatePuesto(puesto: ICatPuesto) {
    try {
      const updated = await CatPuestoDAO.update(puesto);
      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catPuesto/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar',
        code: 500
      };
    }
  }

  static async getCatPuesto(id: string) {
    try {
      const puesto = await CatPuestoDAO.findById(id);
      return {
        ok: true,
        message: 'Puesto encontrado',
        response: puesto,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catPuesto/findById]: ${error}`);
      return {
        ok: false,
        message: 'Error al buscar el puesto',
        code: 500
      };
    }
  }
}