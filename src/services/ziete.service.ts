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
      const zietes = await ZieteDAO.findParticular(fini, ffin, uuidDucto);
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
}