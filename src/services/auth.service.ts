import logger from "../../lib/logger";
import { AuthDAO } from "../daos/auth.dao";
import { ResponseHelper } from "../helpers/response.helper";
import IUser from "../interfaces/user.interface";
import EncryptioClass from "../utils/encryption.util";
import JWTUtil from "../utils/jwt.util";


export class AuthService {
  static encryptClass = new EncryptioClass();

  private removeSensitiveData(user: any) {
    let objectUser = user.toObject()
    delete objectUser.password
    delete objectUser.phone
    delete objectUser.created_at

    return objectUser
  }

  static async register(user: IUser): Promise<{
    ok: boolean;
    message: string;
    createdUser?: IUser;
    code: number;
  }> {
    try {
      const existing = await AuthDAO.findByEmail(user.email);
      if (existing) {
        return {
          ok: false,
          message: "User already exists",
          code: 409,
        };
      }

      const hashedPassword = await this.encryptClass.hashPassword(user.password);
      if (!hashedPassword) {
        return {
          ok: false,
          message: "Problem with password",
          code: 400,
        };
      }

      const newUser = {
        ...user,
        password: hashedPassword,
      };

      const createdUser = await AuthDAO.createUser(newUser);
      if (!createdUser) {
        return {
          ok: false,
          message: "Error creating user",
          code: 500,
        };
      }

      return {
        ok: true,
        message: "Successfully created user",
        createdUser,
        code: 201,
      };
    } catch (error) {
      logger.error(`[service/auth/register]: ${error}`);
      return {
        ok: false,
        message: "Internal server error",
        code: 500,
      };
    }
  }

  static async login(ficha: number, password: string) {
    try {
      const user = await AuthDAO.findByFicha(ficha)
      if (!user) {
        return { ok: false, message: 'Datos no validos 404 - no existe la ficha', code: 404 }
      }
      const passValid = await this.encryptClass.verifyPassword(password, user.password)
      if (!passValid) {
        return { ok: false, message: 'Datos no validos 401 - esta mal la contraseña', code: 401 }
      }
      const payload = {
        user: {
          name: user.name,
          ficha: user.ficha,
          status: user.status,
          role: user.role
        }
      }
      const token = this.encryptClass.generateToken(user)
      return { ok: true, token, user: payload.user, code: 200 }
    } catch (error) {
      logger.error(`[Error/auth/login]: ${error}`)
      return { ok: false, message: 'Internal server error' }
    }
  }

  static async LoginRefresh(decodedUser: any) {
    try {

      const user = decodedUser.payload ?? decodedUser;
      console.log("Entonces user en LoginRefresh:", user)
      const payload = {
        user: {
          name: user.name,
          ficha: user.ficha,
          status: user.status,
          role: user.role
        }
      }
      const jwt = new JWTUtil();
      const token = await jwt.generateToken(payload)
      console.log("token de refresh: ", payload.user)
      return { ok: true, token, user: payload.user, code: 200 }

    } catch (err) {
      logger.error(`[AuthControll/LoginRefresh] ${err}`)
      return { ok: false, message: 'Error ocurred', response: err, code: 500 }
    }
  }



}
