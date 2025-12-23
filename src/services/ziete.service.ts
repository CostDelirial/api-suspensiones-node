import { ZieteDAO } from '../daos/ziete.dao';
import IZiete from '../interfaces/ziete.interface';
import logger from '../../lib/logger';

export class ZieteService {
  

  static async getGeneral(body: IZiete) {
    try {
     const { fini, ffin } = body;
      const zietes = await ZieteDAO.findGeneral(fini, ffin);
      return {
        ok: true,
        message: 'Lista obtenida',
        response: zietes,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/ziete/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener zietes',
        code: 500
      };
    }
  }
 static async getParticular(body: IZiete) {
    try {
      const { fini, ffin, uuidDucto } = body;
      const zietes = await ZieteDAO.findParticular(uuidDucto, fini, ffin );
      return {
        ok: true,
        message: 'Lista obtenida',
        response: zietes,
        code: 200
      };
    } catch (error) {
      logger.error(`[service/ziete/list]: ${error}`);
      return {
        ok: false,
        message: 'Error al obtener zietes',
        code: 500
      };
    }
  }

static async getTimeline(
    uuid_ducto: string,
    fecha_inicio: string,
    fecha_fin: string
  ) {
    try {
      const fini = `${fecha_inicio} 05:00:00`;
      const ffin = `${fecha_fin} 04:59:59`;

      const timeline = await ZieteDAO.findTimeline(
        uuid_ducto,
        fini,
        ffin
      );

      return {
        ok: true,
        message: 'Línea de tiempo obtenida',
        response: timeline,
        code: 200
      };

    } catch (error) {
      logger.error(`[service/timeline/getTimeline]: ${error}`);
      return {
        ok: false,
        message: 'Error al generar línea de tiempo',
        code: 500
      };
    }
  }

}