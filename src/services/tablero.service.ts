import { TableroDAO } from '../daos/tablero.dao';
import ITablero from '../interfaces/tablero.interface';
import logger from '../../lib/logger';
import moment from "moment";

export class TableroService {

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

  // FUNCION MAS IMPORTANTE
  static async createRegistro(body: ITablero) {
    try {
      const { uuid_ducto, uuid_motivo, fecha_usuario } = body;
      const usuarioCreacion = body.usuarioCreacion;
      if (!uuid_ducto || !uuid_motivo || !fecha_usuario || !usuarioCreacion) {
        return {
          ok: false,
          message: "Faltan datos obligatorios.",
          code: 400
        }
      }
      const nuevaFecha = moment(fecha_usuario, "DD/MM/YYYY HH:mm");

      const ultimo = await TableroDAO.findLast(uuid_ducto);
      if (!ultimo) {
        return { ok: false, message: "No existe registro base para este ducto", code: 404 };
      }

      const fechaUltima = moment(ultimo.fecha_usuario);

      if (nuevaFecha.isSameOrBefore(fechaUltima)) {
        return {
          ok: false,
          message: "La nueva fecha debe ser posterior al último registro",
          code: 409
        };
      }

     
      // CALCULAR EL INICIO DEL SIGUIENTE DÍA OPERATIVO (05:00)
      let inicioNext = fechaUltima.clone();

      if (inicioNext.hour() >= 5) {
        inicioNext.add(1, "day");
      }

      inicioNext.set({ hour: 5, minute: 0, second: 0 });

      
      // GENERAR REGISTROS INTERMEDIOS CORRECTOS
      const inserts: any[] = [];

      // Cierre previo del día operativo: 04:59 del inicioNext
      const cierrePrev = inicioNext.clone().subtract(1, "minute"); // 04:59 del día siguiente

      if (cierrePrev.isAfter(fechaUltima) && cierrePrev.isBefore(nuevaFecha)) {
        inserts.push({
          uuid_ducto,
          uuid_motivo: ultimo.uuid_motivo,
          fecha_usuario: cierrePrev.format("YYYY-MM-DD HH:mm:ss"),
          usuario_creacion: usuarioCreacion
        });
      }

      // Apertura inicial: inicioNext (05:00)
      if (inicioNext.isBefore(nuevaFecha)) {
        inserts.push({
          uuid_ducto,
          uuid_motivo: ultimo.uuid_motivo,
          fecha_usuario: inicioNext.format("YYYY-MM-DD HH:mm:ss"),
          usuario_creacion: usuarioCreacion
        });
      }

      // Cierres y aperturas de los días intermedios
      let currentInicio = inicioNext.clone().add(1, "day"); 

      while (true) {
        const cierre = currentInicio.clone().subtract(1, "minute"); 

        if (!cierre.isBefore(nuevaFecha)) break;

        // Insertar cierre
        inserts.push({
          uuid_ducto,
          uuid_motivo: ultimo.uuid_motivo,
          fecha_usuario: cierre.format("YYYY-MM-DD HH:mm:ss"),
          usuario_creacion: usuarioCreacion
        });

        // Insertar apertura
        if (currentInicio.isBefore(nuevaFecha)) {
          inserts.push({
            uuid_ducto,
            uuid_motivo: ultimo.uuid_motivo,
            fecha_usuario: currentInicio.format("YYYY-MM-DD HH:mm:ss"),
            usuario_creacion: usuarioCreacion
          });
        }

        // Avanzar al siguiente día
        currentInicio.add(1, "day");
      }

      // INSERTAR EL REGISTRO FINAL DEL USUARIO
      inserts.push({
        uuid_ducto,
        uuid_motivo,
        fecha_usuario: nuevaFecha.format("YYYY-MM-DD HH:mm:ss"),
        usuario_creacion: usuarioCreacion
      });

      // ORDENAR TODOS LOS REGISTROS ANTES DEL INSERT
      inserts.sort((a, b) => moment(a.fecha_usuario).valueOf() - moment(b.fecha_usuario).valueOf());

      //  INSERTAR EN BD
      await TableroDAO.bulkInsert(inserts);

      return {
        ok: true,
        message: "Registro creado correctamente",
        code: 201,
        response: inserts
      };

    } catch (error) {
      logger.error(`[service/tablero/createRegistro]: ${error}`);
      return {
        ok: false,
        message: "Error interno",
        code: 500
      };
    }
  }



}