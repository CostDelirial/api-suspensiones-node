import { CatSemaforoDAO } from '../daos/catSemaforo.dao';
import ICatSemaforo from '../interfaces/catSemaforo.interface';
import logger from '../../lib/logger';

export class CatSemaforoService {
  static async createCatSemaforo(body: ICatSemaforo) {
    try {
      console.log("Va a buscar si existe lo que intenta ingresar: ", body)
      const exists = await CatSemaforoDAO.findByName(body.nombre);
      console.log("exists: ", exists)
      if (exists) {
        return {
          ok: false,
          message: `El ${body.nombre} ya está registrado.`,
          code: 409
        };
      }

      //GUARDAR EL COLOR EN CSS
      if (!body.color1 || !body.color2) {
        return {
          ok: false,
          message: `color1 y color2 son obligatorios.`,
          code: 400
        };
      }

      const colorCSS = `
      border-radius: 100%;
      width: 0;
      height: 0;
      color: #fff;
      border-right: 25px solid ${body.color1};
      border-top: 25px solid ${body.color1};
      border-left: 25px solid ${body.color2};
      border-bottom: 25px solid ${body.color2};
    `.replace(/\s+/g, ' ').trim();

      body.color = colorCSS;
      console.log("body completo: ", body)


      const newSemaforo = await CatSemaforoDAO.create(body);
      return {
        ok: true,
        message: 'Creado correctamente',
        response: newSemaforo,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catSemaforo/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear',
        code: 500
      };
    }
  }

  static async getCatSemaforos() {
    try {
      console.log("Va a leer todos los puestos")
      const puestos = await CatSemaforoDAO.findAll();
      return {
        ok: true,
        message: 'Lista obtenida',
        response: puestos,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSemaforo/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener puestos',
        code: 500
      };
    }
  }

  static async updateSemaforo(puesto: ICatSemaforo) {
    try {
      const updated = await CatSemaforoDAO.update(puesto);
      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSemaforo/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar',
        code: 500
      };
    }
  }

  static async getCatSemaforo(id: string) {
    try {
      const puesto = await CatSemaforoDAO.findById(id);
      return {
        ok: true,
        message: 'Semaforo encontrado',
        response: puesto,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catSemaforo/findById]: ${error}`);
      return {
        ok: false,
        message: 'Error al buscar el puesto',
        code: 500
      };
    }
  }
}