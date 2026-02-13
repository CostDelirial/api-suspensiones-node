import { pool } from '../../config/db'; 
import ICatPuesto from '../interfaces/catPuesto.interface';

export class CatPuestoDAO {
  static async findAll(): Promise<ICatPuesto[]> {
    const result = await pool.query('SELECT uuid, name, nivel, status FROM cat_puesto');
    return result.rows;
  }

  static async findByNivelName(nivel: number, name: string): Promise<ICatPuesto | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_puesto WHERE nivel = $1 and name = $2 LIMIT 1', [nivel, name]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatPuesto | null> {
    const result = await pool.query('SELECT * FROM cat_puesto WHERE uuid = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<ICatPuesto | null> {
      console.log("va a ejecutar el query")
      const result = await pool.query('SELECT * FROM cat_puesto WHERE name = $1 LIMIT 1', [name]);
      return result.rows[0] || null;
    }

  static async create(puesto: ICatPuesto): Promise<ICatPuesto> {
    const query = `
      INSERT INTO cat_puesto (name, nivel, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [puesto.name, puesto.nivel, puesto.usuarioCreacion, puesto.status || 'true', new Date()];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  
static async update(id: string, ducto: ICatPuesto) {
  const query = `
    UPDATE cat_puesto
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
}