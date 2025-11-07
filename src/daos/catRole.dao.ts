import { pool } from '../../config/db'; 
import ICatRole from '../interfaces/catRole.interface';

export class CatRoleDAO {
  static async findAll(): Promise<ICatRole[]> {
    const result = await pool.query('SELECT * FROM cat_role WHERE status = $1', ['true']);
    return result.rows;
  }

  static async findByName(nombre: string): Promise<ICatRole | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_role WHERE nombre = $1 LIMIT 1', [nombre]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatRole | null> {
    const result = await pool.query('SELECT * FROM cat_role WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(role: ICatRole): Promise<ICatRole> {
    console.log("DATOS del role: ",role)
    const query = `
      INSERT INTO cat_role (nombre, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [role.nombre, role.usuarioCreacion, role.estatus || 'true', new Date()];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(role: ICatRole): Promise<ICatRole> {
    const query = `
      UPDATE cat_role
      SET nombre = $1, nivel = $2, usuario_actualizacion = $3, fecha_actualizacion = NOW(), status = $4
      WHERE id = $5
      RETURNING *`;
    const values = [role.nombre, role.usuarioModificacion, role.estatus, role.id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}