import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import UserService from "../services/user.service";
import JWTUtil from "../utils/jwt.util";
import Encription from "../utils/encryption.util";

export default class UserController {
    private userService: UserService
    private encription: Encription
    constructor() {
        this.userService = new UserService
        this.encription = new Encription
    }

    async createUser(req: Request, res: Response): Promise<any> {
        try {
            console.log("body enviado: ", req.body)
            if (!req.body) {
                return ResponseHelper.error(res, 'No data received', null, 400);
            }
            const token = req.headers.authorization;
            const jwt = new JWTUtil();
            const cleanToken = token!.replace(/^Bearer\s+/i, "");
            const decoded = await jwt.decodeToken(cleanToken as string) as any;
            console.log("decode: ", decoded)
            req.body.usuarioCreacion = decoded.user.ficha

            const response = await UserService.createUser(req.body);

            if (!response.ok) {
                return res.status(400).json({
                    ok: false,
                    message: response.message,
                    response: null,
                    code: 400
                }
                )
            }
            return res.status(201).json({
                ok: true,
                message: 'Creado correctamente.',
                response: response.response,
                code: 201
            });

        } catch (error) {
            logger.error(`[Error/controller/createUser]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getUsers(req: Request, res: Response): Promise<any> {
        try {
            const response = await UserService.getUsers();
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });
        } catch (error) {
            logger.error(`[Error/controller/getUser]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

}
