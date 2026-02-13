import { pool } from '../../config/db';
import IcatSuperintendencia from '../interfaces/catSuperintendencia.interface';

export class CatSuperintendenciaDAO {
  static async create(body: IcatSuperintendencia): Promise<any> {
    const query = `
      INSERT INTO cat_superintendencia (name, fecha_creacion, usuario_creacion, status, uuidsubgerencia, siglas)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [body.name, new Date(), body.usuarioCreacion, 'true', body.uuidSubgerencia, body.siglas];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: string, ducto: IcatSuperintendencia) {
  const query = `
    UPDATE cat_ducto
    SET
      name = $1,
      status = $2,
      usuario_actualizacion = $3,
      fecha_actualizacion = $4
    WHERE uuid = $5
    RETURNING *;
  `;

  const values = [
    ducto.name,
    ducto.status,
    ducto.usuarioModificacion,
    new Date(),
    id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

  static async findAll(): Promise<IcatSuperintendencia[]> {
    const query = 'SELECT uuid, name, status FROM cat_superintendencia';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<IcatSuperintendencia | null> {
    const query = 'SELECT * FROM cat_superintendencia WHERE uuid = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<IcatSuperintendencia | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_superintendencia WHERE name = $1 LIMIT 1', [name]);
    return result.rows[0] || null;
  }

  /** Busca por name o crea uno nuevo, retornando su ID */
  static async getOrCreateByName(name: string): Promise<number> {
    // 1) Intentar encontrar
    const checkQ = `SELECT id FROM cat_superintendencia WHERE name = $1`;
    const checkR = await pool.query(checkQ, [name]);
    if (checkR.rows.length) {
      return checkR.rows[0].id;
    }
    // 2) Si no existe, crear
    const insertQ = `
      INSERT INTO cat_superintendencia (name, fecha_creacion, usuario_creacion, status)
      VALUES ($1, NOW(), 'bulk-upload', 'active')
      RETURNING id
    `;
    const insertR = await pool.query(insertQ, [name]);
    return insertR.rows[0].id;
  }
}