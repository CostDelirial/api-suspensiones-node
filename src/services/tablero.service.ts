import { TableroDAO } from '../daos/tablero.dao';
import ITablero from '../interfaces/tablero.interface';
import logger from '../../lib/logger';
import moment from "moment";

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
          message: `El ducto ya tiene el mismo motivo en el último registro.`,
          code: 500,
        };
      }

      // Crear nuevo registro
      const newTablero = await TableroDAO.create(body);
      return {
        ok: true,
        message: "Registro creado correctamente.",
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

  static async historicoByDucto(uuid_ducto: string) {
    try {
      const data = await TableroDAO.getHistoricoByDucto(uuid_ducto);

      return {
        ok: true,
        message: "Historico obtenido correctamente",
        response: data,
        code: 200,
      };
    } catch (error) {
      logger.error(`[service/tablero/historico]: ${error}`);
      return {
        ok: false,
        message: "Error interno al obtener historico.",
        code: 500,
      };
    }
  }

  static async createRegistro(body: ITablero) {
    const { uuid_ducto, uuid_motivo, fecha_usuario } = body;

    // 1. Obtener el último registro del ducto
    const last = await TableroDAO.getLastByDuct(uuid_ducto);

    // 2. Convertir fechas
    const nuevaFecha = moment(fecha_usuario, "DD/MM/YYYY HH:mm");

    let fechaCursor = moment(last.fecha_usuario);


    // 3. Resultado final
    let inserts = [];

    // 4. Generar cortes hasta el día operativo de la nueva fecha
    while (fechaCursor < nuevaFecha.clone().startOf('day').hour(4).minute(59)) {

      // Día actual 04:59
      inserts.push({
        uuid_ducto,
        uuid_motivo: last.uuid_motivo,
        fecha: fechaCursor.clone().hour(4).minute(59).format("DD/MM/YYYY HH:mm")
      });

      // Día siguiente 05:00
      inserts.push({
        uuid_ducto,
        uuid_motivo: last.uuid_motivo,
        fecha: fechaCursor.clone().add(1, 'day').hour(5).minute(0).format("DD/MM/YYYY HH:mm")
      });

      fechaCursor.add(1, 'day');
    }


    // 5. Insertar cortes generados
    for (let item of inserts) {
      await TableroDAO.insertSimple(item.uuid_ducto, item.uuid_motivo, item.fecha, body.usuarioCreacion, true);

    }

    // 6. Insertar el nuevo motivo en su fecha real
    const nuevaFechaString = moment(fecha_usuario, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm");
    const nuevo = await TableroDAO.insertSimple(uuid_ducto, uuid_motivo, nuevaFechaString, body.usuarioCreacion, true);

    return {
      ok: true,
      message: "Registro agregado correctamente",
      cortesGenerados: inserts.length,
      nuevo,
      code: 201
    };
  }

}