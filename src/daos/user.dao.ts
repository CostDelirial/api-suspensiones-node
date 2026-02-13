import { pool } from '../../config/db';
import IUser from '../interfaces/user.interface';

export class UserDAO {
  static async findAll(): Promise<IUser[]> {
    const result = await pool.query('SELECT u.uuid,u.ficha, u.name, r.name AS role, p.name AS nivel, u.status ' +
      'FROM "user" u LEFT JOIN cat_role r ON u.role = r.uuid ' +
      'LEFT JOIN cat_puesto p ON u.nivel = p.uuid;');
    return result.rows;
  }

  static async getUserById(id: string): Promise<IUser | null> {
    const result = await pool.query('SELECT * FROM "user" WHERE uuid = $1 LIMIT 1', [id]);
    return result.rows[0] || null;
  }

  static async getUserByFicha(id: number): Promise<IUser | null> {
    const result = await pool.query('SELECT * FROM "user" WHERE ficha = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<IUser | null> {
    const result = await pool.query('SELECT * FROM "user" WHERE name = $1 LIMIT 1', [name]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string) {
    const query = `SELECT * FROM "user" WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async create(user: IUser): Promise<IUser> {
    const query = `
      INSERT INTO "user" (name, ficha, usuariocreacion, status, fechacreacion, password, role, nivel, salt, gerencia, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`;
    const values = [user.name, user.ficha, user.usuarioCreacion, true, new Date(),
    user.password, user.role, user.nivel, user.salt, user.gerencia, user.email];
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(uuid: string, user: any) {
    console.log("user a dao: ", user)
    const query = `
    UPDATE "user"
    SET
      name = $1,
      ficha = $2,
      status = $3,
      role = $4,
      nivel = $5,
      gerencia = $6,
      email = $7,
      usuarioactualizacion = $8,
      fechaactualizacion = $9
    WHERE uuid = $10
    RETURNING *;
  `;

    const values = [
      user.name,
      user.ficha,
      user.status,
      user.role,
      user.nivel,
      user.gerencia,
      user.email,
      user.usuarioActualizacion,
      new Date(),
      uuid
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updatePass(uuid: string, user: any) {
    console.log("dao: user: ", user)
    const query = `
    UPDATE "user"
    SET
      password = $1,
      usuarioactualizacion = $2,
      fechaactualizacion = $3
    WHERE uuid = $4
    RETURNING *;
  `;

    const values = [
      user.password,
      user.usuarioActualizacion,
      new Date(),
      uuid
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

}