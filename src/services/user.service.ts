import PostgresConn from "../../lib/postgres"
import IUser from "../interfaces/user.interface"
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
}