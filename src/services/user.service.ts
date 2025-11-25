import { UserDAO } from '../daos/user.dao';
import IUser from '../interfaces/user.interface';
import logger from '../../lib/logger';
import EncryptioClass from "../utils/encryption.util";
export default class UserService {
    static encryptClass = new EncryptioClass();
    static async createUser(body: IUser) {
        try {
            const exists = await UserDAO.getUserByFicha(body.ficha);
            console.log("exists: ", exists)
            if (exists) {
                return {
                    ok: false,
                    message: `La ficha ${body.ficha} ya está registrada.`,
                    code: 409
                };
            }

            const salt = await this.encryptClass.generateSalt();
            const hashedPassword = await this.encryptClass.hashPasswordWithSalt(
                body.password,
                salt
            );
            body.password = hashedPassword;
            body.salt = salt;

            const newRole = await UserDAO.create(body);
            return {
                ok: true,
                message: 'Creado correctamente',
                response: newRole,
                code: 201
            };
        } catch (error) {
            logger.error(`[service/user/create]: ${error}`);
            return {
                ok: false,
                message: 'Error interno al crear',
                code: 500
            };
        }
    }


    async getUserByFicha(ficha: number) {
        try {
            const existUser = await UserDAO.getUserByFicha(ficha)
            return existUser
        } catch (err) {

            throw err
        } finally {
        }
    }

    async getUserById(id: string) {
        try {
            const existUser = await UserDAO.getUserById(id)
            return existUser
        } catch (err) {

            throw err
        } finally {
        }
    }

    static async getUsers() {
        try {
            const puestos = await UserDAO.findAll();
            return {
                ok: true,
                message: 'Lista obtenida',
                response: puestos,
                code: 200
            };
        } catch (error) {
            logger.error(`[service/user/list]: ${error}`);
            return {
                ok: false,
                message: 'Error al obtener usuarios',
                code: 500
            };
        }
    }


}