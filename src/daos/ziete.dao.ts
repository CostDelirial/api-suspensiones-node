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
            WHEN coalesce(logistico, true)  = true 
            THEN horas ELSE 0 END
          ) / NULLIF(SUM(horas), 0) * 100, 2
        )                                       AS "pLogistico",

        ROUND(
          SUM(CASE 
            WHEN coalesce(logistico, false) = false 
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

  static async findParticular(
  uuidDucto: string,
  fini: Date,
  ffin: Date
) {

  const query = `
    WITH ordenados AS (
      SELECT
        t.uuid_ducto,
        t.uuid_motivo,
        m.nombre AS motivo,
        m.logistico,
        t.fecha_usuario,
        LEAD(t.fecha_usuario) OVER (
          PARTITION BY t.uuid_ducto
          ORDER BY t.fecha_usuario
        ) AS fecha_siguiente,
        LEAD(m.logistico) OVER (
          PARTITION BY t.uuid_ducto
          ORDER BY t.fecha_usuario
        ) AS logistico_siguiente
      FROM tableroControl t
      INNER JOIN cat_motivo m ON t.uuid_motivo = m.uuid
      WHERE
        t.uuid_ducto = $1
        AND t.fecha_usuario BETWEEN $3 AND $4
        AND m.nombre NOT IN ('OPERANDO', 'OPERANDO PARCIAL') 
    ),
    calculo AS (
      SELECT
        motivo,
        EXTRACT(EPOCH FROM (fecha_siguiente - fecha_usuario)) / 3600 AS horas
      FROM ordenados
      WHERE
        logistico = $2
        AND logistico_siguiente = $2
        AND fecha_siguiente IS NOT NULL
    )
    SELECT
      motivo AS movimientos,
      ROUND(SUM(horas), 2) AS tiempoHoras,
      ROUND(SUM(horas) / 24, 2) AS dias,
      COUNT(*) AS ocurrencia
    FROM calculo
    GROUP BY motivo
    ORDER BY tiempoHoras DESC;
  `;

  const logisticos = await pool.query(query, [
    uuidDucto,
    true,
    fini,
    ffin
  ]);

  const noLogisticos = await pool.query(query, [
    uuidDucto,
    false,
    fini,
    ffin
  ]);

  return {
    logisticos: logisticos.rows,
    noLogisticos: noLogisticos.rows
  };
}

static async findTimeline(
    uuid_ducto: string,
    fecha_inicio: string,
    fecha_fin: string
  ) {

    const query = `
      WITH movimientos AS (
        SELECT
          t.fecha_usuario,
          CASE
            WHEN m.nombre IN ('OPERANDO', 'OPERANDO PARCIAL')
              THEN 'operando'
            ELSE 'suspendido'
          END AS tipo
        FROM tableroControl t
        INNER JOIN cat_motivo m ON t.uuid_motivo = m.uuid
        WHERE t.uuid_ducto = $1
          AND t.fecha_usuario BETWEEN $2 AND $3
        ORDER BY t.fecha_usuario
      ),
      diferencias AS (
        SELECT
          tipo,
          fecha_usuario,
          LAG(tipo) OVER (ORDER BY fecha_usuario) AS tipo_anterior,
          LAG(fecha_usuario) OVER (ORDER BY fecha_usuario) AS fecha_anterior
        FROM movimientos
      ),
      horas AS (
        SELECT
          tipo,
          fecha_usuario,
          fecha_anterior,
          EXTRACT(
            EPOCH FROM (fecha_usuario - fecha_anterior)
          ) / 3600 AS horas,
          CASE
            WHEN tipo <> tipo_anterior THEN 1
            ELSE 0
          END AS cambio
        FROM diferencias
        WHERE fecha_anterior IS NOT NULL
      ),
      grupos AS (
        SELECT
          tipo,
          horas,
          SUM(cambio) OVER (ORDER BY fecha_usuario) AS grupo
        FROM horas
      )
      SELECT
        tipo AS type,
        ROUND(SUM(horas) / 24, 2) AS dias
      FROM grupos
      GROUP BY tipo, grupo
      ORDER BY grupo;
    `;

    const values = [
      uuid_ducto,
      fecha_inicio,
      fecha_fin
    ];
    const result = await pool.query(query, values);
    return result.rows;
  }


}