import { pool } from '../../config/db'; 
import ICatSemaforo from '../interfaces/catSemaforo.interface';

export class CatSemaforoDAO {
  static async findAll(): Promise<ICatSemaforo[]> {
    const result = await pool.query('SELECT uuid, nombre, color, status FROM cat_semaforo ');
    return result.rows;
  }

  static async findByName(nombre: string): Promise<ICatSemaforo | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_semaforo WHERE nombre = $1 LIMIT 1', [nombre]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatSemaforo | null> {
    const result = await pool.query('SELECT * FROM cat_semaforo WHERE uuid = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(semaforo: ICatSemaforo): Promise<ICatSemaforo> {
    console.log("DATOS del semaforo: ",semaforo)
    const query = `
      INSERT INTO cat_semaforo (nombre, color, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [semaforo.name, semaforo.color, semaforo.usuarioCreacion, semaforo.status || 'true', new Date()];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(id: string, ducto: ICatSemaforo) {
  const query = `
    UPDATE cat_semaforo
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