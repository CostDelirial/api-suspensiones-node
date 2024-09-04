import { NextFunction, Request, Response } from "express";
import IResponse from "../interfaces/response.interface";
import JWTUtil from "../utils/jwt.util";

export default class Authenticate {
    
    async autetication(req: Request, res: Response, next: NextFunction){
        try {
            if(!req.headers.authorization){
                const response: IResponse = {
                    ok: false,
                    message: "La peticion no tiene la cabecera de autenticacion",
                    response: null,
                    code: 403,
                };
                return res.status(response.code).json(response)
            }
            const jwtUtil = new JWTUtil()
            const token = req.headers.authorization.replace("Bearer ","") as string;
            const decodeUser = await jwtUtil.decodeToken(token);
            if(!decodeUser){
                const response: IResponse = {
                    ok: false,
                    message: "Token invalido",
                    response: null,
                    code: 403,
                  };
                  return res.status(response.code).json(response)
            }
            
            req.body.user_client = decodeUser;
            next();
        } catch (error) {
            console.log(error)
            return res.status(403).send({ message: "Token invalido" });
        }
    }
}