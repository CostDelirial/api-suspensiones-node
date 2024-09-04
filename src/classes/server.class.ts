import http from 'http';
import express from 'express';
import config from 'config';
import logger from '../../lib/logger';
export default class HttpServer {
  private port: number;
  private httpServer: http.Server;
  private static _instance: HttpServer;
  public app: express.Application;


  constructor() {
    this.port = config.get('api.port');
    this.app = express();
    this.httpServer = new http.Server(this.app);
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  async start() {
    try {
      await this.httpServer.listen(this.port);
      logger.info(`Server run on port: ${this.port}`);
    } catch (err) {
      logger.error(`Error: ${err}`);
    }
  }
  
}
