import { pool } from '../../config/db'; 
import ICatDucto from '../interfaces/catDucto.interface';

export class CatDuctoDAO {
  static async findAll(): Promise<ICatDucto[]> {
    const result = await pool.query('SELECT * FROM cat_ducto WHERE status = $1', ['true']);
    return result.rows;
  }

  static async findByName(nombre: string): Promise<ICatDucto | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_ducto WHERE nombre = $1 LIMIT 1', [nombre]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatDucto | null> {
    const result = await pool.query('SELECT * FROM cat_ducto WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(ducto: ICatDucto): Promise<ICatDucto> {
    console.log("DATOS del ducto: ",ducto)
    const query = `
      INSERT INTO cat_ducto (nombre, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [ducto.nombre, ducto.usuarioCreacion, ducto.estatus || 'true', new Date()];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(ducto: ICatDucto): Promise<ICatDucto> {
    const query = `
      UPDATE cat_ducto
      SET nombre = $1, nivel = $2, usuario_actualizacion = $3, fecha_actualizacion = NOW(), status = $4
      WHERE id = $5
      RETURNING *`;
    const values = [ducto.nombre, ducto.usuarioModificacion, ducto.estatus, ducto.id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}