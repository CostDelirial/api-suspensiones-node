import { pool } from '../../config/db';
import ICatDucto from '../interfaces/catDucto.interface';

export class CatDuctoDAO {
  static async findAll(): Promise<ICatDucto[]> {
    const result = await pool.query('SELECT uuid, nombre, status FROM cat_ducto ');
    return result.rows;
  }

  static async findByName(nombre: string): Promise<ICatDucto | null> {
    const result = await pool.query('SELECT * FROM cat_ducto WHERE nombre = $1 LIMIT 1', [nombre]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<ICatDucto | null> {
    const result = await pool.query('SELECT * FROM cat_ducto WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /*static async create(ducto: ICatDucto): Promise<ICatDucto> {
    const query = `
      INSERT INTO cat_ducto (nombre, usuario_creacion, status, fecha_creacion)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [ducto.nombre, ducto.usuarioCreacion, ducto.estatus || 'true', new Date()];
    console.log("values: ", values)
    const result = await pool.query(query, values);
    console.log("result: ", result)
    return result.rows[0];
  }*/

  static async create(ducto: ICatDucto): Promise<ICatDucto> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Crear ducto
      const insertDuctoQuery = `
      INSERT INTO cat_ducto (
        nombre,
        usuario_creacion,
        status,
        fecha_creacion
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

      const ductoValues = [
        ducto.nombre,
        ducto.usuarioCreacion,
        ducto.estatus ?? true,
        new Date()
      ];

      const ductoResult = await client.query(insertDuctoQuery, ductoValues);
      const newDucto = ductoResult.rows[0];

      // Obtener uuid del motivo "CARGA INICIAL"
      const motivoResult = await client.query(`
      SELECT uuid
      FROM cat_motivo
      WHERE nombre = 'CARGA INICIAL'
      LIMIT 1
    `);

      if (motivoResult.rowCount === 0) {
        throw new Error('No existe el motivo CARGA INICIAL');
      }

      const uuidMotivo = motivoResult.rows[0].uuid;

      // Insertar registro inicial en tableroControl
      await client.query(
        `
      INSERT INTO tableroControl (
        uuid_ducto,
        uuid_motivo,
        fecha_usuario,
        status,
        fecha_creacion,
        usuario_creacion
      )
      VALUES (
        $1,
        $2,
        NOW(),
        true,
        NOW(),
        $3
      )
      `,
        [
          newDucto.uuid,
          uuidMotivo,
          ducto.usuarioCreacion
        ]
      );

      await client.query('COMMIT');

      return newDucto;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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