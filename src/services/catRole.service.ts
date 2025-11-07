import { CatRoleDAO } from '../daos/catRole.dao';
import ICatRole from '../interfaces/catRole.interface';
import logger from '../../lib/logger';

export class CatRoleService {
  static async createCatRole(body: ICatRole) {
    try {
      console.log("Va a buscar si existe lo que intenta ingresar: ", body)
      const exists = await CatRoleDAO.findByName(body.nombre);
      console.log("exists: ", exists)
      if (exists) {
        return {
          ok: false,
          message: `El nivel ${body.nombre} ya está registrado.`,
          code: 409
        };
      }
console.log("pasoo: ", body)
      const newRole = await CatRoleDAO.create(body);
      return {
        ok: true,
        message: 'Creado correctamente',
        response: newRole,
        code: 201
      };
    } catch (error) {
      logger.error(`[service/catRole/create]: ${error}`);
      return {
        ok: false,
        message: 'Error interno al crear',
        code: 500
      };
    }
  }

  static async getCatRoles() {
    try {
      console.log("Va a leer todos los puestos")
      const puestos = await CatRoleDAO.findAll();
      return {
        ok: true,
        message: 'Lista obtenida',
        response: puestos,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catRole/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener puestos',
        code: 500
      };
    }
  }

  static async updateRole(puesto: ICatRole) {
    try {
      const updated = await CatRoleDAO.update(puesto);
      return {
        ok: true,
        message: 'Actualizado correctamente',
        response: updated,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catRole/update]: ${error}`);
      return {
        ok: false,
        message: 'Error al actualizar',
        code: 500
      };
    }
  }

  static async getCatRole(id: string) {
    try {
      const puesto = await CatRoleDAO.findById(id);
      return {
        ok: true,
        message: 'Role encontrado',
        response: puesto,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/catRole/findById]: ${error}`);
      return {
        ok: false,
        message: 'Error al buscar el puesto',
        code: 500
      };
    }
  }
}