import { loadEnv } from "./middlewares/envars.js";
import { Server } from "./server/Server.js";
import { Handler, Layer, LayerConfig } from "./types/routeTypes.js";

export type { Request, Response } from "./types/httpTypes.js";
export type { Handler, Layer };

export class Rensa {
  app: Server;
  createServer: () => void;

  constructor () {
    this.app = new Server();
    this.createServer = this.app.createServer;
//     this.app.createServer();
//     this.server = this.app.server;
  }

  use (middleware: Layer, config?: LayerConfig) {
    this.app.use(middleware, config);
  }

  useBuiltin (midd: string, ...opts: any[]) {
    this.app.useBuiltin(midd, ...opts);
  }

  viewEngine (engine: string, folder: string = 'views') {
    this.app.viewEngine(engine, folder);
  }

  get (path: string, ...handlers: Function[]) {
    this.app.get(path, ...handlers);
  }

  post (path: string, ...handlers: Function[]) {
    this.app.post(path, ...handlers);
  }

  put (path: string, ...handlers: Function[]) {
    this.app.put(path, ...handlers);
  }

  patch (path: string, ...handlers: Function[]) {
    this.app.patch(path, ...handlers);
  }

  delete (path: string, ...handlers: Function[]) {
    this.app.delete(path, ...handlers);
  }

  notFound (handler: Handler) {
    this.app.notFound(handler);
  }

  listen (port: number, callback: () => void) {
    this.createServer();
    this.app.listen(port, callback);
  }
}

export function env (): void {
  loadEnv();
}
