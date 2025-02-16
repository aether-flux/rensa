import { RouteStore } from "./RouteStore.js";

export class Router {
  constructor () {
    this.middlewares = [];
    this.routes = {};  // Storing callbacks
    this.store = new RouteStore();
  }

  add (method, path, ...handlers) {
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

  handle (method, path, req, res) {
    // Handle middlewares
    let index = 0;
    const middlewares =  [...this.middlewares];

    const next = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index];
        index++;
        middleware(req, res, next);
      } else {
        this.handleRoute(method, path, req, res);
     }
    }

    next();
  }

  handleRoute (method, path, req, res) {
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
      res.statusCode = 404;
      res.end("No matching route found.");
      return;
    }

    const {middlewares, handler} = routeData;
    let index = 0;

    const next = () => {
      if (index < middlewares.length) {
        let midw = middlewares[index];
        index++;
        midw(req, res, next);
      } else {
        handler(req, res);
      }
    };

    if (middlewares.length > 0) {
      next();
    } else {
      handler(req, res);
    }
  }
}
