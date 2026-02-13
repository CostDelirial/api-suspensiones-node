import { pool } from '../../config/db'; 
import ICatRole from '../interfaces/catRole.interface';

export class CatRoleDAO {
  static async findAll(): Promise<ICatRole[]> {
    const result = await pool.query('SELECT uuid, name, status FROM cat_role ');
    return result.rows;
  }

  static async findByName(name: string): Promise<ICatRole | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_role WHERE name = $1 LIMIT 1', [name]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatRole | null> {
    const result = await pool.query('SELECT * FROM cat_role WHERE uuid = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(role: ICatRole): Promise<ICatRole> {
    console.log("DATOS del role: ",role)
    const query = `
      INSERT INTO cat_role (name, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [role.name, role.usuarioCreacion, role.status || 'true', new Date()];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(id: string, ducto: ICatRole) {
    console.log("Body que entro al DAO: ", ducto)
  const query = `
    UPDATE cat_role
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