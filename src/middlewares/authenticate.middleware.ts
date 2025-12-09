import { NextFunction, Request, Response } from "express";
import IResponse from "../interfaces/response.interface";
import JWTUtil from "../utils/jwt.util";

export default class Authenticate {
    
    static async autetication(req: Request, res: Response, next: NextFunction){
        try {
            if(!req.headers.authorization){
                const response: IResponse = {
                    ok: false,
                    message: "La peticion no tiene la cabecera de autenticacion. Mensaje enviado desde middleware.",
                    response: null,
                    code: 403,
                };
                return res.status(response.code).json(response)
            }
            const jwtUtil = new JWTUtil()
            const token = req.headers.authorization.replace("Bearer ","") as string;
            const decoded = await jwtUtil.decodeToken(token);
          
            if(!decoded){
                const response: IResponse = {
                    ok: false,
                    message: "Token invalido. Mensaje enviado desde middleware.",
                    response: null,
                    code: 403,
                  };
                  return res.status(response.code).json(response)
            }
            req.body.user_client = decoded;
            next();
        } catch (error) {
            console.log(error)
            return res.status(403).send({ message: "Token invalido. Mensaje enviado desde middleware 2." });
        }
    }
}