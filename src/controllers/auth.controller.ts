import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { AuthService } from "../services/auth.service";
import JWTUtil from "../utils/jwt.util";

export default class AuthController {
    async register(req: Request, res: Response): Promise<any> {
        try {
            if (!req.body) {
                return ResponseHelper.error(res, 'Please provide user data', null, 400);
            }

            const user = await AuthService.register(req.body);

            if (!user?.ok) {
                return ResponseHelper.error(res, user.message, user?.createdUser, user?.code);
            }

            return ResponseHelper.success(res, 'User created successfully', user, 201);
        } catch (error) {
            logger.error(`[Error/controller/register]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async login(req: Request, res: Response): Promise<any> {
        try {
            const { ficha, password } = req.body;

            if (!ficha || !password) {
                return res.status(400).json({
                    ok: false,
                    message: 'Falta ficha o contraseña',
                    code: 400
                });
            }

            const result = await AuthService.login(ficha, password);
            console.log("Auth controller result:", result);

            if (!result.ok) {
                let statusCode = 400;
                if (result.message?.toLowerCase().includes('not found') || result.code === 404) {
                    statusCode = 404;
                } else if (result.message?.toLowerCase().includes('password') || result.code === 401) {
                    statusCode = 401;
                }
                return res.status(statusCode).json({
                    ok: false,
                    message: result.message || 'Credenciales inválidas',
                    code: statusCode
                });
            }

            return res.status(200).json({
                ok: true,
                message: 'Auth login successfully',
                user: result.user,
                token: result.token,
                code: 200
            });

        } catch (error) {
            logger.error(`[Error/auth/controller/login]: ${error}`);
            return ResponseHelper.error(res, 'Error interno del servidor', null, 500);
        }
    }

    async auth(req: Request, res: Response): Promise<any> {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHelper.error(res, 'No se recibio token.', null, 500)
            }
            const jwt = new JWTUtil();
            const decoded = await jwt.decodeToken(token as string) as any;

                const result = await AuthService.LoginRefresh(decoded.user ?? decoded)

            return res.status(201).json({
                ok: true,
                message: 'Auth refresh successfully',
                user: result.user,
                token: result.token,
                code: 201
            });
        } catch (error) {
            logger.error(`[Error/auth/controller/login]: ${error}`)
            return ResponseHelper.error(res, 'Error ocurred', null, 500)
        }
    }

}
