import { RouteStore } from "./RouteStore.js";

export class Router {
  constructor () {
    this.routes = {};  // Storing callbacks
    this.store = new RouteStore();
  }

  add (method, path, callback) {
    this.store.insert(path);

    if (!this.routes[method]) this.routes[method] = {};
    this.routes[method][path] = callback;
  }

  handle (method, path, req, res) {
    req.params = {};  // Ensuring req.params is always an object

    // Check if method exists
    if (!this.routes[method]) {
      res.statusCode = 405;
      res.end(`Method ${method} Not Allowed.`);
      return;
    }

    // Handle static routes (/user, /profile/dashboard etc)
    if (this.routes[method][path]) {
      this.routes[method][path](req, res);
      return;
    }

    // Handle dynamic routes (/user/:id, /post/:post-slug etc)
    const result = this.store.search(path);

    if (result) {
      const { params, url } = result;

      if (this.routes[method][url]) {
        req.params = params;
        this.routes[method][url](req, res);
        return;
      }
    }

    res.statusCode = 404;
    res.end("No matching route found.");
  }
}
