import { pool } from '../../config/db';
import IZiete from "../interfaces/ziete.interface";

export class ZieteDAO {

  static async findGeneral(fini: Date, ffin: Date): Promise<IZiete[]> {

    const query = `
      WITH base AS (
        SELECT
          t.uuid_ducto,
          d.nombre AS n_ducto,
          t.fecha_usuario,
          m.nombre AS motivo,
          m.logistico,
          LEAD(t.fecha_usuario) OVER (
            PARTITION BY t.uuid_ducto
            ORDER BY t.fecha_usuario
          ) AS fecha_siguiente
        FROM tableroControl t
        INNER JOIN cat_ducto d ON d.uuid = t.uuid_ducto
        INNER JOIN cat_motivo m ON m.uuid = t.uuid_motivo
        WHERE t.fecha_usuario BETWEEN $1 AND $2
      ),

      calculos AS (
        SELECT
          uuid_ducto,
          n_ducto,
          fecha_usuario,
          motivo,
          logistico,
          EXTRACT(EPOCH FROM (fecha_siguiente - fecha_usuario)) / 3600 AS horas
        FROM base
        WHERE fecha_siguiente IS NOT NULL
      )

      SELECT
        uuid_ducto                               AS "uuidDucto",
        n_ducto                                 AS "nDucto",

        -- TIEMPOS
        SUM(CASE 
          WHEN motivo IN ('OPERANDO', 'OPERANDO PARCIAL') 
          THEN horas ELSE 0 END
        )::TEXT                                 AS "tOperando",

        ROUND(
        SUM(
        CASE
        WHEN motivo IN ('OPERANDO', 'OPERANDO PARCIAL') 
        THEN horas ELSE 0
        END
        ) / 24, 2
        )                                       AS "dOperando",

        SUM(CASE 
          WHEN motivo NOT IN ('OPERANDO', 'OPERANDO PARCIAL') 
          THEN horas ELSE 0 END
        )::TEXT                                 AS "tFueraOpe",

        ROUND(
        SUM(
        CASE
        WHEN motivo NOT IN ('OPERANDO', 'OPERANDO PARCIAL') 
        THEN horas ELSE 0
        END
        ) / 24, 2
        )                                       AS "dFueraOpe",

        -- PORCENTAJES
        ROUND(
          SUM(CASE 
            WHEN motivo IN ('OPERANDO', 'OPERANDO PARCIAL') 
            THEN horas ELSE 0 END
          ) / NULLIF(SUM(horas), 0) * 100, 2
        )                                       AS "pTO",

        ROUND(
          SUM(CASE 
            WHEN motivo NOT IN ('OPERANDO', 'OPERANDO PARCIAL') 
            THEN horas ELSE 0 END
          ) / NULLIF(SUM(horas), 0) * 100, 2
        )                                       AS "pFO",

        ROUND(
          SUM(CASE 
            WHEN logistico = true 
            THEN horas ELSE 0 END
          ) / NULLIF(SUM(horas), 0) * 100, 2
        )                                       AS "pLogistico",

        ROUND(
          SUM(CASE 
            WHEN logistico = false 
            THEN horas ELSE 0 END
          ) / NULLIF(SUM(horas), 0) * 100, 2
        )                                       AS "pNoLogistico"

      FROM calculos
      GROUP BY uuid_ducto, n_ducto
      ORDER BY n_ducto;
    `;

    // Ajuste de día operativo
    const fechaInicio = `${fini} 05:00:00`;
    const fechaFin = `${ffin} 04:59:59`;

    const result = await pool.query(query, [fechaInicio, fechaFin]);
    return result.rows;
  }

  static async findParticular(fini: Date, ffin: Date, id: string): Promise<IZiete | null> {
    const result = await pool.query('SELECT * FROM cat_puesto WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

}