import { Request, Response } from "express";
import logger from "../../lib/logger";
import { ResponseHelper } from "../helpers/response.helper";
import { CatRoleService } from "../services/catRole.service";
import JWTUtil from "../utils/jwt.util";
import UserService from "../services/user.service";

export default class CatRoleController {

    async createCatRole(req: Request, res: Response): Promise<any> {
        try {
            req.body.usuarioCreacion = req.body.user_client.payload.ficha
            const response = await CatRoleService.createCatRole(req.body);
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
                message: 'Creado correctamente el rol: ' + response.response?.nombre,
                response: response.response,
                code: 201
            });

        } catch (error) {
            logger.error(`[Error/controller/createCatRole]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async getCatRoles(req: Request, res: Response): Promise<any> {
        try {
            const response = await CatRoleService.getCatRoles();
            return res.status(200).json({
                ok: true,
                message: 'Datos obtenidos correctamente.',
                response: response.response,
                code: 200
            });
        } catch (error) {
            logger.error(`[Error/controller/getCatRoles]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }

    async delete(req: Request, res: Response): Promise<any> {
        try {
            const { _id } = req.body;
            const token = req.headers.authorization;

            if (!_id || !token) {
                return ResponseHelper.error(res, 'Missing ID or token', null, 400);
            }

            const jwtUtil = new JWTUtil();
            const userService = new UserService();

            const user = await jwtUtil.decodeToken(token) as any;
            const infoUser = await userService.getUserById(user.id);
            const infoRole = await CatRoleService.getCatRole(_id) as any;

            infoRole.status = infoRole.status === 'inactive' ? 'active' : 'inactive';
            infoRole.fechaActualizacion = new Date();
            if (infoUser != null)
                infoRole.usuarioActualizacion = infoUser.ficha;

            const updated = await CatRoleService.updateRole(infoRole);

            return ResponseHelper.success(res, 'Role updated successfully', updated, 200);
        } catch (error) {
            logger.error(`[Error/controller/deleteCatRole]: ${error}`);
            return ResponseHelper.error(res, 'Internal Server Error', null, 500);
        }
    }
}