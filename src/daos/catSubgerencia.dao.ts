import { pool } from '../../config/db';
import  IcatSubgerencia  from '../interfaces/catSubgerencia.interface';

export class CatSubgerenciaDAO {
  static async create(body: IcatSubgerencia): Promise<any> {
    const query = `
      INSERT INTO cat_subgerencia (name, siglas, fecha_creacion, usuario_creacion, status, uuidgerencia)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [body.name, body.siglas, new Date(), body.usuarioCreacion, 'true', body.uuidGerencia];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

    static async findAll(): Promise<IcatSubgerencia[]> {
    const query = 'SELECT uuid, name, status FROM cat_subgerencia';
    const result = await pool.query(query);
    return result.rows;
  }

   static async findByName(nombre: string): Promise<IcatSubgerencia | null> {
      console.log("va a ejecutar el query")
      const result = await pool.query('SELECT * FROM cat_subgerencia WHERE nombre = $1 LIMIT 1', [nombre]);
      return result.rows[0] || null;
    }
  

  static async findById(id: string): Promise<IcatSubgerencia | null> {
    const query = 'SELECT * FROM cat_subgerencia WHERE uuid = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

   /** Busca por nombre o crea uno nuevo, retornando su ID */
   static async getOrCreateByName(nombre: string): Promise<number> {
    // 1) Intentar encontrar
    const checkQ = `SELECT id FROM cat_subgerencia WHERE nombre = $1`;
    const checkR = await pool.query(checkQ, [nombre]);
    if (checkR.rows.length) {
      return checkR.rows[0].id;
    }
    // 2) Si no existe, crear
    const insertQ = `
      INSERT INTO cat_subgerencia (nombre, fecha_creacion, usuario_creacion, status)
      VALUES ($1, NOW(), 'bulk-upload', 'active')
      RETURNING id
    `;
    const insertR = await pool.query(insertQ, [nombre]);
    return insertR.rows[0].id;
  }

  static async update(id: string, ducto: IcatSubgerencia) {
  const query = `
    UPDATE cat_subgerencia
    SET
      nombre = $1,
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


}