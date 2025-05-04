import { Handler, Layer, RouteData } from "../types/routeTypes.js";
import { RouteStore } from "./RouteStore.js";

export class Router {
  private middlewares: Layer[];
  private routes: { [method: string]: { [path: string]: RouteData } };
  private store: RouteStore;
  private notFoundHandler: Handler;

  constructor () {
    this.middlewares = [];
    this.routes = {};  // Storing callbacks
    this.store = new RouteStore();
    this.notFoundHandler = (req, res) => {
      res.statusCode = 404;
      res.end("No matching route found.");
    }
  }

  setNotFound (handler: Handler): void {
    this.notFoundHandler = handler;
  }

  async add (method: string, path: string, ...handlers: Function[]): Promise<void> {
    this.store.insert(path);

    let middlewares: Layer[] = [];
    let handler: (req: any, res: any) => void;

    if (handlers.length > 1) {
      middlewares = handlers.slice(0, -1) as Layer[];
      handler = handlers[handlers.length - 1] as Handler;
    } else {
      handler = handlers[0] as Handler;
    }

    if (!this.routes[method]) this.routes[method] = {};
    this.routes[method][path] = {middlewares, handler};
  }

  use (middleware: Layer): void {
    this.middlewares.push(middleware);
  }

  async handle (method: string, path: string, req: any, res: any): Promise<void> {
    // Handle middlewares
    let index = 0;
    const middlewares =  [...this.middlewares];

    const next = async () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index];
        index++;
        try {
          await middleware(req, res, next);
        } catch (e) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      } else {
        await this.handleRoute(method, path, req, res);
     }
    }

    await next();
  }

  async handleRoute (method: string, path: string, req: any, res: any): Promise<void> {
    req.params = {};

    if (!this.routes[method]) {
      res.statusCode = 405;
      res.end(`Method ${method} Not Allowed.`);
      return;
    }

    let routeData = this.routes[method][path];

    if (!routeData) {
      const result = this.store.search(path);

      if (result) {
        const { params, url } = result;
        req.params = params;
        routeData = this.routes[method][url];
      }
    }

    if (!routeData) {
      return await this.notFoundHandler(req, res);
    }

    const { middlewares, handler } = routeData;
    let index = 0;

    const next = async () => {
      if (index < middlewares.length) {
        let midw = middlewares[index];
        index++;
        try {
          await midw(req, res, next);
        } catch (e) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      } else {
        await handler(req, res);
      }
    };

    if (middlewares.length > 0) {
      await next();
    } else {
      await handler(req, res);
    }
  }
}
