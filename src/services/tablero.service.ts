import { TableroDAO } from '../daos/tablero.dao';
import ITablero from '../interfaces/tablero.interface';
import logger from '../../lib/logger';

export class TableroService {
  static async createTablero(body: ITablero) {
    try {
      console.log("Va a buscar el último registro del ducto: ", body.uuid_ducto);

      // Buscar el último registro del ducto por fecha más reciente
      const lastRecord = await TableroDAO.findLastByDucto(body.uuid_ducto);

      console.log("Último registro encontrado: ", lastRecord);

      // Si existe y tiene el mismo motivo, no se puede insertar
      if (lastRecord && lastRecord.uuid_motivo === body.uuid_motivo) {
        return {
          ok: false,
          message: `El ducto ya tiene el mismo motivo en el último registro (${body.uuid_motivo}). Debe ser diferente.`,
          code: 409,
        };
      }

      // Crear nuevo registro
      const newTablero = await TableroDAO.create(body);
      return {
        ok: true,
        message: "Registro creado correctamente",
        response: newTablero,
        code: 201,
      };
    } catch (error) {
      logger.error(`[service/tablero/create]: ${error}`);
      return {
        ok: false,
        message: "Error interno al crear el registro en tableroControl",
        code: 500,
      };
    }
  }

  static async getAll() {
    try {
      const data = await TableroDAO.findAll();
      return {
        ok: true,
        message: "Registros obtenidos correctamente",
        response: data,
        code: 200,
      };
    } catch (error) {
      logger.error(`[service/tablero/getAll]: ${error}`);
      return {
        ok: false,
        message: "Error al obtener registros",
        code: 500,
      };
    }
  }

  static async tableroPrincipal() {
    try {
      const data = await TableroDAO.getTableroPrincipal();

      return {
        ok: true,
        message: "Tablero principal obtenido correctamente",
        response: data,
        code: 200,
      };
    } catch (error) {
      logger.error(`[service/tablero/tableroPrincipal]: ${error}`);
      return {
        ok: false,
        message: "Error interno al obtener tablero principal",
        code: 500,
      };
    }
  }
}