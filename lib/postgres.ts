import { Sequelize } from "sequelize-typescript"
import config from 'config'
import logger from '../lib/logger'

export default class PostgresConn {
    private static _intance: PostgresConn | null = null
    private sequelize: Sequelize | null = null
    
    private constructor(){
    }
    public static getInstance(): PostgresConn {
        if(PostgresConn._intance === null){
            PostgresConn._intance = new PostgresConn()
        }
        return PostgresConn._intance
    }

    public async connectDB(){
        if(!this.sequelize){
            this.sequelize = new Sequelize({
                database: config.get('db.name') as string,
                username: config.get('db.user') as string,
                password: config.get('db.password') as string,
                host: config.get('db.host') as string,
                port: config.get('db.port') as number,
                dialect: 'postgres',
                logging: (msg) => logger.info(msg),
            })
            try{
                await this.sequelize.authenticate()
                logger.info(`Connected to database ${config.get('db.name')}`)
            }catch(err){
                logger.error(`Error connection to database: ${err}`)
                this.sequelize = null
            }
        }
    }

    public async disconnectDb(){
        if(this.sequelize){
            try{
                await this.sequelize.close()
                this.sequelize = null
            }catch(err){
                logger.error(`Error disconnecting from database: ${err}`)
            }
        }
    }

    public getSequelizeInstance(): Sequelize| null {
        return this.sequelize
    }
}