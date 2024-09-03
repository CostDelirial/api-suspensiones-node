import { Sequelize } from 'sequelize-typescript'
import config from 'config'
import logger from '../lib/logger'
import UserModel from '../src/models/user.model';

export default class PostgresConn {
    private static _instance: PostgresConn | null = null;
    private sequelize: Sequelize | null = null;

    private constructor() {}

    public static getInstance(): PostgresConn {
        if (PostgresConn._instance === null) {
            PostgresConn._instance = new PostgresConn();
        }
        return PostgresConn._instance;
    }

    public async connectDB() {
        if (!this.sequelize) {
            this.sequelize = new Sequelize({
                database: config.get('db.name') as string,
                username: config.get('db.user') as string,
                password: config.get('db.password') as string,
                host: config.get('db.host') as string,
                port: config.get('db.port') as number,
                dialect: 'postgres',
                logging: (msg) => logger.info(`[Postgres]`),

                models: [UserModel],  // Registra tus modelos aquí
                
            })
            try {
                await this.sequelize.authenticate()
                logger.info(`Connected to database ${config.get('db.name')}`)
                // await this.sequelize.sync({force: true}) //// solo  desarrollo
                // logger.info('Database synchronized.');
            } catch (err) {
                logger.error(`Error connecting to database: ${err}`);
                this.sequelize = null;
            }
        }
    }

    public async disconnectDB() {
        if (this.sequelize) {
            try {
                await this.sequelize.close();
                this.sequelize = null;
            } catch (err) {
                logger.error(`Error disconnecting from database: ${err}`);
            }
        }
    }

    public getSequelizeInstance(): Sequelize | null {
        return this.sequelize;
    }
}
