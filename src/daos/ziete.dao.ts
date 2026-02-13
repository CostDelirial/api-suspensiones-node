import { pool } from '../../config/db';
import IZiete from "../interfaces/ziete.interface";

export class ZieteDAO {

  static async findGeneral(fini: Date, ffin: Date): Promise<IZiete[]> {

    const query = `
      WITH base_raw AS (

  SELECT
    t.uuid_ducto,
    d.name AS n_ducto,
    t.fecha_usuario,
    m.name AS motivo,
    m.logistico
  FROM tableroControl t
  INNER JOIN cat_ducto d ON d.uuid = t.uuid_ducto
  INNER JOIN cat_motivo m ON m.uuid = t.uuid_motivo
  WHERE t.fecha_usuario BETWEEN $1 AND $2

  UNION ALL

  SELECT
    t.uuid_ducto,
    d.name AS n_ducto,
    t.fecha_usuario,
    m.name AS motivo,
    m.logistico
  FROM tableroControl t
  INNER JOIN cat_ducto d ON d.uuid = t.uuid_ducto
  INNER JOIN cat_motivo m ON m.uuid = t.uuid_motivo
  WHERE t.fecha_usuario < $1
    AND t.uuid_ducto IN (
      SELECT DISTINCT uuid_ducto
      FROM tableroControl
      WHERE fecha_usuario BETWEEN $1 AND $2
    )
  ORDER BY uuid_ducto, fecha_usuario DESC
),

base AS (
  SELECT
    uuid_ducto,
    n_ducto,
    fecha_usuario,
    motivo,
    logistico,
    COALESCE(
      LEAD(fecha_usuario) OVER (
        PARTITION BY uuid_ducto
        ORDER BY fecha_usuario
      ),
      $2::timestamp
    ) AS fecha_siguiente
  FROM base_raw
),

calculos AS (
  SELECT
    uuid_ducto,
    n_ducto,
    fecha_usuario,
    motivo,
    logistico,
    EXTRACT(
      EPOCH FROM (
        LEAST(fecha_siguiente, $2::timestamp)
        - GREATEST(fecha_usuario, $1::timestamp)
      )
    ) / 3600 AS horas
  FROM base
  WHERE
    fecha_siguiente IS NOT NULL
    AND LEAST(fecha_siguiente, $2::timestamp)
        > GREATEST(fecha_usuario, $1::timestamp)
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
    SUM(CASE
      WHEN motivo IN ('OPERANDO', 'OPERANDO PARCIAL') 
      THEN horas ELSE 0
    END) / 24, 2
  )                                       AS "dOperando",

  SUM(CASE 
    WHEN motivo NOT IN ('OPERANDO', 'OPERANDO PARCIAL') 
    THEN horas ELSE 0 END
  )::TEXT                                 AS "tFueraOpe",

  ROUND(
    SUM(CASE
      WHEN motivo NOT IN ('OPERANDO', 'OPERANDO PARCIAL') 
      THEN horas ELSE 0
    END) / 24, 2
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
      WHEN COALESCE(logistico, true) = true 
      THEN horas ELSE 0 END
    ) / NULLIF(SUM(horas), 0) * 100, 2
  )                                       AS "pLogistico",

  ROUND(
    SUM(CASE 
      WHEN COALESCE(logistico, false) = false 
      THEN horas ELSE 0 END
    ) / NULLIF(SUM(horas), 0) * 100, 2
  )                                       AS "pNoLogistico"

FROM calculos
GROUP BY uuid_ducto, n_ducto
ORDER BY n_ducto;
`
    // Ajuste de día operativo
    const fechaInicio = `${fini} 05:00:00`;
    const aux = new Date(ffin)
    aux.setDate(aux.getDate() + 1)
    const fechaFinAux = aux.toISOString().split('T')[0]
    const fechaFin = `${fechaFinAux} 04:59:00`;

    const result = await pool.query(query, [fechaInicio, fechaFin]);
    return result.rows;
  }


  // MODULO PARTICULAR POR DUCTO
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
        m.name AS motivo,
        m.logistico,
        t.fecha_usuario,
        coalesce(
        LEAD(t.fecha_usuario) OVER (
          PARTITION BY t.uuid_ducto
          ORDER BY t.fecha_usuario
		  ),
		  $4::timestamp
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
        --AND m.name NOT IN ('OPERANDO', 'OPERANDO PARCIAL') 
    ),
    calculo AS (
      SELECT
        motivo,
        EXTRACT(EPOCH FROM (fecha_siguiente - fecha_usuario)) / 3600 AS horas
      FROM ordenados
      WHERE
        logistico = $2
        --AND logistico_siguiente = $2
        --AND fecha_siguiente IS NOT NULL
    )
    SELECT
      motivo AS movimientos,
      ROUND(SUM(horas), 2) AS tiempoHoras,
      ROUND(SUM(horas) / 24, 2) AS dias,
      COUNT(*) AS ocurrencia
    FROM calculo
    WHERE motivo NOT IN ('OPERANDO', 'OPERANDO PARCIAL')
    GROUP BY motivo
    ORDER BY tiempoHoras DESC;
  `;


  // Ajuste de día operativo
    const fechaInicio = `${fini} 05:00:00`;
    const aux = new Date(ffin)
    aux.setDate(aux.getDate() + 1)
    const fechaFinAux = aux.toISOString().split('T')[0]
    const fechaFin = `${fechaFinAux} 04:59:00`;

  const logisticos = await pool.query(query, [
    uuidDucto,
    true,
    fechaInicio,
    fechaFin
  ]);

  const noLogisticos = await pool.query(query, [
    uuidDucto,
    false,
    fechaInicio,
    fechaFin
  ]);

  return {
    logisticos: logisticos.rows,
    noLogisticos: noLogisticos.rows
  };
}

static async findTimeline(
    uuid_ducto: string,
    fecha_inicio: Date,
    fecha_fin: Date
  ) {

    const query = `
      WITH eventos_rango AS (
  SELECT
    t.fecha_usuario,
    CASE
      WHEN m.name IN ('OPERANDO', 'OPERANDO PARCIAL')
        THEN 'operando'
      ELSE 'suspendido'
    END AS tipo
  FROM tableroControl t
  INNER JOIN cat_motivo m ON t.uuid_motivo = m.uuid
  WHERE t.uuid_ducto = $1
    AND t.fecha_usuario BETWEEN
        $2
        AND $3
),

evento_inicio AS (
  SELECT
    $2::timestamp AS fecha_usuario,
    CASE
      WHEN m.name IN ('OPERANDO', 'OPERANDO PARCIAL')
        THEN 'operando'
      ELSE 'suspendido'
    END AS tipo
  FROM tableroControl t
  INNER JOIN cat_motivo m ON t.uuid_motivo = m.uuid
  WHERE t.uuid_ducto = $1
    AND t.fecha_usuario < $2
  ORDER BY t.fecha_usuario DESC
  LIMIT 1
),

eventos AS (
  SELECT * FROM eventos_rango
  UNION ALL
  SELECT * FROM evento_inicio
  UNION ALL
  SELECT
    $3::timestamp AS fecha_usuario,
    NULL AS tipo
),

ordenados AS (
  SELECT
    tipo,
    fecha_usuario,
    LEAD(fecha_usuario) OVER (ORDER BY fecha_usuario) AS fecha_siguiente,
    LAG(tipo) OVER (ORDER BY fecha_usuario) AS tipo_anterior
  FROM eventos
),

tramos AS (
  SELECT
    tipo,
    fecha_usuario,
    fecha_siguiente,
    EXTRACT(EPOCH FROM (fecha_siguiente - fecha_usuario)) / 3600 AS horas,
    CASE
      WHEN tipo <> tipo_anterior THEN 1
      ELSE 0
    END AS cambio
  FROM ordenados
  WHERE fecha_siguiente IS NOT NULL
    AND tipo IS NOT NULL
),

grupos AS (
  SELECT
    tipo,
    horas,
    SUM(cambio) OVER (ORDER BY fecha_usuario) AS grupo
  FROM tramos
)

SELECT
  tipo AS type,
  ROUND(SUM(horas) / 24, 2) AS dias
FROM grupos
GROUP BY grupo, tipo
ORDER BY grupo;
    `;

    // Ajuste de día operativo
    const fechaInicio = `${fecha_inicio} 05:00:00`;
    const aux = new Date(fecha_fin)
    aux.setDate(aux.getDate() + 1)
    const fechaFinAux = aux.toISOString().split('T')[0]
    const fechaFin = `${fechaFinAux} 04:59:00`;


    console.log("line time: ", fechaInicio, " - ", fechaFin)

    const values = [
      uuid_ducto,
      fechaInicio,
      fechaFin
    ];
    const result = await pool.query(query, values);
    return result.rows;
  }


}