import { pool } from '../../config/db'; 
import ICatMotivo from '../interfaces/catMotivo.interface';

export class CatMotivoDAO {
  static async findAll(): Promise<ICatMotivo[]> {
    const result = await pool.query('SELECT * FROM cat_motivo WHERE status = $1', ['true']);
    return result.rows;
  }

  static async findByName(nombre: string): Promise<ICatMotivo | null> {
    console.log("va a ejecutar el query")
    const result = await pool.query('SELECT * FROM cat_motivo WHERE nombre = $1 LIMIT 1', [nombre]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatMotivo | null> {
    const result = await pool.query('SELECT * FROM cat_motivo WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(motivo: ICatMotivo): Promise<ICatMotivo> {
    console.log("DATOS del motivo: ",motivo)
    const query = `
      INSERT INTO cat_motivo (nombre, usuario_creacion, status, fecha_creacion, logistico, uuid_semaforo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [motivo.nombre, motivo.usuarioCreacion, motivo.estatus || 'true', new Date(), motivo.logistico, motivo.uuidSemaforo ];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }

  static async update(motivo: ICatMotivo): Promise<ICatMotivo> {
    const query = `
      UPDATE cat_motivo
      SET nombre = $1, nivel = $2, usuario_actualizacion = $3, fecha_actualizacion = NOW(), status = $4
      WHERE id = $5
      RETURNING *`;
    const values = [motivo.nombre, motivo.usuarioModificacion, motivo.estatus, motivo.id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}