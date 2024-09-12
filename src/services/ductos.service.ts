import PostgresConn from "../../lib/postgres"
import DuctosModel from "../models/ductos.model"


export default class DuctosService {
    private db: PostgresConn
    constructor(){
        this.db = PostgresConn.getInstance()
    }

    async createDuctos(body: any){
        try{
            await this.db.connectDB()
            console.log("Aqui si llega")
            const newDuctos = await DuctosModel.create( body)
            return newDuctos
        }catch(err){
            
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }


    /**async getDuctos(){
        try{
            await this.db.connectDB()
            const ductos = await DuctosModel.findAll()
            return ductos
        }catch(err){    
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }*/

    /**async getDuctosById(idDuctos: number){
        try{
            await this.db.connectDB()
            const ductosById = await DuctosModel.findByPk(idDuctos)
            return ductosById
        }catch(err){
            
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }*/

    /**async getDuctos(name: string){
        try{
            await this.db.connectDB()
            const existDuctos = await DuctosModel.findOne({where:{name: name}})
            return existDuctos
        }catch(err){
            
            throw err
        }finally{
            await this.db.disconnectDB()
        }
    }*/
}