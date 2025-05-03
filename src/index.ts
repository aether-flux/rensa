import { loadEnv } from "./middlewares/envars.js";
import { Server } from "./server/Server.js";
import { Handler, Middleware } from "./types/routeTypes.js";

export class Rensa {
  app: Server;
  createServer: () => void;

  constructor () {
    this.app = new Server();
    this.createServer = this.app.createServer;
//     this.app.createServer();
//     this.server = this.app.server;
  }

  use (middleware: Middleware) {
    this.app.use(middleware);
  }

  useBuiltin (midd: string, ...opts: any[]) {
    this.app.useBuiltin(midd, ...opts);
  }

  viewEngine (engine: string, folder: string = 'views') {
    this.app.viewEngine(engine, folder);
  }

  get (path: string, ...handlers: Handler[]) {
    this.app.get(path, ...handlers);
  }

  post (path: string, ...handlers: Handler[]) {
    this.app.post(path, ...handlers);
  }

  put (path: string, ...handlers: Handler[]) {
    this.app.put(path, ...handlers);
  }

  patch (path: string, ...handlers: Handler[]) {
    this.app.patch(path, ...handlers);
  }

  delete (path: string, ...handlers: Handler[]) {
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
