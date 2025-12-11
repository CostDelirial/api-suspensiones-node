import { pool } from '../../config/db';
import ITablero from '../interfaces/tablero.interface';

export class TableroDAO {

 static async findLast(uuid_ducto: string) {
    const query = `
      SELECT *
      FROM tablerocontrol
      WHERE uuid_ducto = $1
      ORDER BY fecha_usuario DESC
      LIMIT 1
    `;
    const values = [uuid_ducto];

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Crear nuevo registro
  static async create(tablero: ITablero) {
    // Revisar el formato de la fecha
    console.log("datos para guardar en el tablero: ", tablero)
    const query = `
      INSERT INTO tableroControl 
      (uuid_ducto, uuid_motivo, fecha_usuario, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, TO_TIMESTAMP($3, 'DD/MM/YYYY HH24:MI'), $4, $5, NOW())
      RETURNING *;
    `;
    const values = [
      tablero.uuid_ducto,
      tablero.uuid_motivo,
      tablero.fecha_usuario,
      tablero.usuarioCreacion,
      tablero.status ?? true,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener todos los registros
  static async findAll() {
    const query = `
      SELECT t.*, 
             d.nombre AS ducto,
             m.nombre AS motivo,
             m.uuid AS uuid_motivo,
             s.nombre AS semaforo
      FROM tableroControl t
      LEFT JOIN cat_ducto d ON t.uuid_ducto = d.uuid
      LEFT JOIN cat_motivo m ON t.uuid_motivo = m.uuid
      LEFT JOIN cat_semaforo s ON m.uuid_semaforo = s.uuid
      ORDER BY t.fecha_usuario DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
  static async getTableroPrincipal() {
    const query = `
      SELECT DISTINCT ON (t.uuid_ducto)
          t.uuid,
          t.uuid_ducto,
          d.nombre AS ducto,
          t.uuid_motivo,
          m.nombre AS motivo,
          m.logistico,
          s.nombre AS semaforo,
          s.color AS color,
          to_char(t.fecha_usuario, 'DD/MM/YYYY HH24:MI') AS fecha_usuario,
          t.status,
          t.fecha_creacion,
          t.usuario_creacion
      FROM tableroControl t
      INNER JOIN cat_ducto d ON t.uuid_ducto = d.uuid
      INNER JOIN cat_motivo m ON t.uuid_motivo = m.uuid
      INNER JOIN cat_semaforo s ON m.uuid_semaforo = s.uuid
      WHERE d.status = true
      ORDER BY t.uuid_ducto, t.fecha_usuario DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Obtiene el historico registrado por ducto
  static async getHistoricoByDucto(uuid_ducto: string) {
    const query = `
     SELECT  
          t.uuid,
          t.uuid_ducto,
          d.nombre AS ducto,
          t.uuid_motivo,
          m.nombre AS motivo,
          m.logistico,
          s.nombre AS semaforo,
          s.color AS color,
          to_char(t.fecha_usuario, 'DD/MM/YYYY HH24:MI') AS fecha_usuario,
          t.status,
          t.fecha_creacion,
          t.usuario_creacion
      FROM tableroControl t
      INNER JOIN cat_ducto d ON t.uuid_ducto = d.uuid
      INNER JOIN cat_motivo m ON t.uuid_motivo = m.uuid
      INNER JOIN cat_semaforo s ON m.uuid_semaforo = s.uuid
      WHERE t.uuid_ducto = $1
      AND NOT (
      to_char(t.fecha_usuario, 'HH24:MI') = '04:59'
      or to_char(t.fecha_usuario, 'HH24:MI') = '05:00'
      )
      ORDER BY t.fecha_usuario DESC;
    `;
    const result = await pool.query(query, [uuid_ducto]);
    return result.rows || null;
  }

  static async insertSimple(uuid_ducto: string, uuid_motivo: string, fecha: string, usuarioCreacion: string, status: boolean) {

    const query = `
      INSERT INTO tableroControl 
      (uuid_ducto, uuid_motivo, fecha_usuario, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, TO_TIMESTAMP($3, 'DD/MM/YYYY HH24:MI'), $4, $5, NOW())
      RETURNING *;
    `;
    const values = [
      uuid_ducto,
      uuid_motivo,
      fecha,
      usuarioCreacion,
      status ?? true,
    ];
    const result = await pool.query(query, values);
    return result

  }

  static async getLastByDuct(uuid_ducto: string) {
    const query = `
    SELECT *
    FROM tablerocontrol
    WHERE uuid_ducto = $1
    ORDER BY fecha_usuario DESC
    LIMIT 1
  `;
    const result = await pool.query(query, [uuid_ducto]);
    return result.rows[0] || null;
  }

  static async bulkInsert(registros: {
    uuid_ducto: string,
    uuid_motivo: string,
    fecha_usuario: string | Date,
    km?: number,
    observaciones?: string,
    usuario_creacion?: string
  }[]) {
    if (!registros || registros.length === 0) return [];

    let query = `
      INSERT INTO tablerocontrol
      (uuid_ducto, uuid_motivo, fecha_usuario, km, observaciones, usuario_creacion, fecha_creacion, status)
      VALUES 
    `;

    const values: any[] = [];
    let placeholders: string[] = [];

    registros.forEach((r, i) => {
      const base = i * 8;

      placeholders.push(`(
        $${base + 1},
        $${base + 2},
        $${base + 3},
        $${base + 4},
        $${base + 5},
        $${base + 6},
        $${base + 7},
        $${base + 8}
      )`);

      values.push(
        r.uuid_ducto,
        r.uuid_motivo,
        r.fecha_usuario,
        r.km || null,
        r.observaciones || null,
        r.usuario_creacion ,
        new Date(),
        true
      );
    });

    query += placeholders.join(", ");

    query += ` RETURNING *`;

    const result = await pool.query(query, values);
    return result.rows;
  }

}