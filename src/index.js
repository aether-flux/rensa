import { Server } from "./server/Server.js";

export class RevApp {
  constructor () {
    this.app = new Server();
  }

  use (middleware) {
    this.app.use(middleware);
  }

  get (path, ...handlers) {
    this.app.get(path, ...handlers);
  }

  post (path, ...handlers) {
    this.app.post(path, ...handlers);
  }

  put (path, ...handlers) {
    this.app.put(path, ...handlers);
  }

  patch (path, ...handlers) {
    this.app.patch(path, ...handlers);
  }

  delete (path, ...handlers) {
    this.app.delete(path, ...handlers);
  }

  listen (port, callback) {
    this.app.listen(port, callback);
  }
}
