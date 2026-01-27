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


    static async updateUser(uuid: string, body: any) {
        try {
            const { usuarioActualizacion } = body;
            const userActual = await UserDAO.getUserById(uuid);

            if (!userActual) {
                return {
                    ok: false,
                    message: 'El usuario no existe',
                    code: 404
                };
            }

            // Validar ficha duplicada
            if (body.ficha && body.ficha !== userActual.ficha) {
                const existsFicha = await UserDAO.getUserByFicha(body.ficha);
                if (existsFicha) {
                    return {
                        ok: false,
                        message: 'La ficha ya está registrada',
                        code: 409
                    };
                }
            }

            // Validar email duplicado
            if (body.email && body.email !== userActual.email) {
                const existsEmail = await UserDAO.findByEmail(body.email);
                if (existsEmail) {
                    return {
                        ok: false,
                        message: 'El email ya está registrado',
                        code: 409
                    };
                }
            }

            userActual.usuarioActualizacion = usuarioActualizacion

            const updatedUser = await UserDAO.update(uuid, body);

            return {
                ok: true,
                message: 'Usuario actualizado correctamente',
                response: updatedUser,
                code: 200
            };

        } catch (error) {
            logger.error(`[service/user/update]: ${error}`);
            return {
                ok: false,
                message: 'Error interno al actualizar usuario',
                code: 500
            };
        }
    }

    static async updatePass(uuid: string, body: any) {
        try {
            const { passwordActual, passwordNueva, usuarioActualizacion } = body;
            const userActual = await UserDAO.getUserById(uuid);
            if (!userActual) {
                return {
                    ok: false,
                    message: 'El usuario no existe',
                    code: 404
                };
            }
            userActual.usuarioActualizacion = usuarioActualizacion
            // Validar que la contraseña actual coincida con la de BD
            const isSamePassword = await this.encryptClass.comparePassword(
                passwordActual,
                userActual.password
            );

            if (!isSamePassword) {
                return {
                    ok: false,
                    message: 'La contraseña actual es incorrecta',
                    code: 401
                };
            }

            // Validar que la nueva contraseña NO sea igual a la actual
            const isSameAsNew = await this.encryptClass.comparePassword(
                passwordNueva,
                userActual.password
            );

            if (isSameAsNew) {
                return {
                    ok: false,
                    message: 'La nueva contraseña no puede ser igual a la anterior',
                    code: 409
                };
            }

            // Encriptar nueva contraseña
            const hashedPassword = await this.encryptClass.hashPassword(passwordNueva);
            if (!hashedPassword) {
                return {
                    ok: false,
                    message: 'Error al generar la nueva contraseña',
                    code: 400
                };
            }
            userActual.password = hashedPassword

            // Actualizar en BD
            const updatedUser = await UserDAO.updatePass(uuid, userActual);

            return {
                ok: true,
                message: 'Password actualizado correctamente',
                response: updatedUser,
                code: 200
            };

        } catch (error) {
            logger.error(`[service/user/updatePass]: ${error}`);
            return {
                ok: false,
                message: 'Error interno al actualizar password',
                code: 500
            };
        }
    }
}