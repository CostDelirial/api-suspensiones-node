import { pool } from '../../config/db'; 
import ICatPuesto from '../interfaces/catPuesto.interface';

export class CatPuestoDAO {
  static async findAll(): Promise<ICatPuesto[]> {
    const result = await pool.query('SELECT * FROM cat_puesto WHERE status = $1', ['active']);
    return result.rows;
  }

  static async findByNivelName(nivel: number, nombre: string): Promise<ICatPuesto | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_puesto WHERE nivel = $1 and nombre = $2 LIMIT 1', [nivel, nombre]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatPuesto | null> {
    const result = await pool.query('SELECT * FROM cat_puesto WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(puesto: ICatPuesto): Promise<ICatPuesto> {
    console.log("DATOS del puesto: ",puesto)
    const query = `
      INSERT INTO cat_puesto (nombre, nivel, usuario_creacion, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [puesto.nombre, puesto.nivel, puesto.usuarioCreacion, puesto.estatus || 'true'];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(puesto: ICatPuesto): Promise<ICatPuesto> {
    const query = `
      UPDATE cat_puesto
      SET nombre = $1, nivel = $2, usuario_actualizacion = $3, fecha_actualizacion = NOW(), status = $4
      WHERE id = $5
      RETURNING *`;
    const values = [puesto.nombre, puesto.nivel, puesto.usuarioModificacion, puesto.estatus, puesto.id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}