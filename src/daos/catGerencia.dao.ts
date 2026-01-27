import { pool } from '../../config/db';
import  ICatGerencia  from '../interfaces/catGerencia.interface';

export class CatGerenciaDAO {
  static async create(body: ICatGerencia): Promise<any> {
    const query = `
      INSERT INTO cat_gerencia (name, fecha_creacion, usuario_creacion, status, siglas)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [body.name, new Date(), body.usuarioCreacion, 'true', body.siglas];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: string, ducto: ICatGerencia) {
  const query = `
    UPDATE cat_gerencia
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


  static async findAll(): Promise<ICatGerencia[]> {
    console.log("3")
    const query = 'SELECT uuid, name, status FROM cat_gerencia';
    const result = await pool.query(query);
    console.log("findAll gerencias: ", result)
    return result.rows;
  }

  static async findById(id: string): Promise<ICatGerencia | null> {
    const query = 'SELECT * FROM cat_gerencia WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  
    static async findByName(nombre: string): Promise<ICatGerencia | null> {
      const result = await pool.query('SELECT * FROM cat_gerencia WHERE nombre = $1 LIMIT 1', [nombre]);
      return result.rows[0] || null;
    }

}