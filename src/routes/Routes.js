import { RouteStore } from "./RouteStore.js";

export class Router {
  constructor () {
    this.middlewares = [];
    this.routes = {};  // Storing callbacks
    this.store = new RouteStore();
    this.notFoundHandler = (req, res) => {
      res.statusCode = 404;
      res.end("No matching route found.");
    }
  }

  setNotFound (handler) {
    this.notFoundHandler = handler;
  }

  async add (method, path, ...handlers) {
    this.store.insert(path);

    let middlewares = [];
    let handler;

    if (handlers.length > 1) {
      middlewares = handlers.slice(0, -1);
      handler = handlers[handlers.length - 1];
    } else {
      handler = handlers[0];
    }

    if (!this.routes[method]) this.routes[method] = {};
    this.routes[method][path] = {middlewares, handler};
  }

  use (middleware) {
    this.middlewares.push(middleware);
  }

  async handle (method, path, req, res) {
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

  async handleRoute (method, path, req, res) {
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
        const {params, url} = result;
        req.params = params;
        routeData = this.routes[method][url];
      }
    }

    if (!routeData) {
      return await this.notFoundHandler(req, res);
    }

    const {middlewares, handler} = routeData;
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
