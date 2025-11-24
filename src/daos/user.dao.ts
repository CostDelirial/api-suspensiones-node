import { pool } from '../../config/db'; 
import IUser from '../interfaces/user.interface';

export class UserDAO {
  static async findAll(): Promise<IUser[]> {
    const result = await pool.query('SELECT u.uuid, u.name, r.nombre AS rol, p.nombre AS nivel, u.status '+ 
      'FROM "user" u LEFT JOIN cat_role r ON u.role = r.uuid '+
      'LEFT JOIN cat_puesto p ON u.nivel = p.uuid;');
    return result.rows;
  }

  static async getUserById(id: string): Promise<IUser | null> {
    const result = await pool.query('SELECT * FROM "user" WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0] || null;
  }

  static async getUserByFicha(id: number): Promise<IUser | null> {
    console.log("va a revisar si ya existe la ficha: ", id)
    const result = await pool.query('SELECT * FROM "user" WHERE ficha = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(user: IUser): Promise<IUser> {
    console.log("AQUI")
    const query = `
      INSERT INTO "user" (name, ficha, usuariocreacion, status, fechacreacion, password, role, nivel, salt, gerencia, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`;
    const values = [user.name, user.ficha, user.usuarioCreacion, user.status || 'true', new Date(), 
      user.password, user.role, user.nivel, user.salt, user.gerencia, user.email];
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }
}