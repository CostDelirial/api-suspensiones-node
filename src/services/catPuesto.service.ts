import { CatPuestoDAO } from '../daos/catPuesto.dao';
import ICatPuesto from '../interfaces/catPuesto.interface';
import logger from '../../lib/logger';

export class CatPuestoService {
  static async createCatPuesto(body: ICatPuesto) {
    try {
      console.log("Va a buscar si existe lo que intenta ingresar: ", body)
      const exists = await CatPuestoDAO.findByNivelName(body.nivel, body.name);
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

  
static async updateCatPuesto(id: string, body: ICatPuesto) {
  try {
    console.log("Actualizando ducto ID:", id, "Body:", body);

    const ductoActual = await CatPuestoDAO.findById(id);
    if (!ductoActual) {
      return {
        ok: false,
        message: 'El puesto no existe.',
        code: 404
      };
    }

    // Validar nombre duplicado solo si cambia
    if (body.name && body.name !== ductoActual.name) {
      const exists = await CatPuestoDAO.findByName(body.name);
      if (exists) {
        return {
          ok: false,
          message: `El nivel ${body.name} ya está registrado.`,
          code: 409
        };
      }
    }

    const updatedPuesto = await CatPuestoDAO.update(id, body);

    return {
      ok: true,
      message: 'Actualizado correctamente',
      response: updatedPuesto,
      code: 200
    };

  } catch (error) {
    logger.error(`[service/catPuesto/update]: ${error}`);
    return {
      ok: false,
      message: 'Error interno al actualizar',
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