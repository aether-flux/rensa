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

  handle (method, path) {
    const result = this.store.search(path);

    if (result) {
      const { params, url } = result;

      if (this.routes[method] && this.routes[method][url]) {
        this.routes[method][url](params);
      }
    } else {
      throw new Error("No matching route found.");
    }
  }
}
