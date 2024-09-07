import PostgresConn from "../../lib/postgres"
import UserModel from "../models/user.model"


export default class UserService {
    private db: PostgresConn
    constructor(){
        this.db = PostgresConn.getInstance()
    }

    async createUser(body: any){
        try{
            await this.db.connectDB()
            const newUser = await UserModel.create( body)
            return newUser
        }catch(err){
            
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }


    async getUsers(){
        try{
            await this.db.connectDB()
            const users = await UserModel.findAll()
            return users
        }catch(err){    
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }

    async getUserById(idUser: number){
        try{
            await this.db.connectDB()
            const userById = await UserModel.findByPk(idUser)
            return userById
        }catch(err){
            
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }

    async getUser(ficha: number){
        try{
            await this.db.connectDB()
            const existUser = await UserModel.findOne({where:{ficha: ficha}})
            return existUser
        }catch(err){
            
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }
}