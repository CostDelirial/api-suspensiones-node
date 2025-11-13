import { pool } from '../../config/db'; 
import ITablero from '../interfaces/tablero.interface';

export class TableroDAO {
 
   // Obtiene el último registro por ducto
  static async findLastByDucto(uuid_ducto: string) {
    const query = `
      SELECT * FROM tableroControl
      WHERE uuid_ducto = $1
      ORDER BY fecha_usuario DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [uuid_ducto]);
    return result.rows[0] || null;
  }

  // Crear nuevo registro
  static async create(tablero: ITablero) {
    const query = `
      INSERT INTO tableroControl 
      (uuid_ducto, uuid_motivo, fecha_usuario, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, NOW())
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
          t.fecha_usuario,
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
}