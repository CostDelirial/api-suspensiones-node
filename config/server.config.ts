import http from 'http';
import express from 'express';
import logger from '../lib/logger';
import { Server as SocketIOServer } from 'socket.io';

export default class HttpServer {
    private port: number;
    private httpServer: http.Server;
    private static _instance: HttpServer;
    public app: express.Application;
    public io: SocketIOServer; // <-- agregamos socket.io

    private constructor() {
        this.port = Number(process.env.PORT) || 5002;
        this.app = express();

        // Creamos el servidor HTTP
        this.httpServer = new http.Server(this.app);

        // Inicializamos socket.io
        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                origin: '*', // Ajusta según tu frontend
            },
        });

        // Configuramos eventos globales
        this.io.on('connection', (socket) => {
            logger.info(`[SocketIO]: Cliente conectado ${socket.id}`);

            socket.on('disconnect', () => {
                logger.info(`[SocketIO]: Cliente desconectado ${socket.id}`);
            });
        });
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    async start() {
        try {
            this.httpServer.listen(this.port, () => {
                logger.info(`[HttpServer/start]: Server run on port ${this.port}`);
            });
        } catch (err: any) {
            logger.error(`[HttpServer/start]: Error ${err}`);
        }
    }

    async stop() {
        try {
            this.httpServer.close();
            logger.info('[HttpServer/stop]: Server stopped');
        } catch (err: any) {
            logger.error(`[HttpServer/stop]: Error ${err}`);
        }
    }
}