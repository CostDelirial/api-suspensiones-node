import {pool} from "../../config/db"
import {UserModel} from "../models/user.model"


export default class UserService {
    
    async createUser(body: any){
        try{
            console.log("Body: ", body)
            const newUser = await UserModel.create( body)
            return newUser
        }catch(err){
            
            throw err
        }finally{
        }
    }

    async getUserByFicha(ficha: number){
        try{
            const existUser = await UserModel.findOne({where:{ficha: ficha}})
            return existUser
        }catch(err){
            
            throw err
        }finally{
        }
    }

    async getUserById(ficha: number){
        try{
            const existUser = await UserModel.findOne({where:{ficha: ficha}})
            return existUser
        }catch(err){
            
            throw err
        }finally{
        }
    }

    async getUsers() {
        try {
          console.log("Va a leer todos los usuarios")
          const usuarios = await UserModel.findAll();
          return {
            ok: true,
            message: 'Lista obtenida',
            response: usuarios,
            code: 200
          };
        } catch (error) {
          return {
            ok: false,
            message: 'Error al obtener usuarios',
            code: 500
          };
        }
      }
    

}