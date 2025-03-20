import { Server } from "./server/Server.js";

export class Rensa {
  constructor () {
    this.app = new Server();
    this.createServer = this.app.createServer;
//     this.app.createServer();
//     this.server = this.app.server;
  }

  use (middleware) {
    this.app.use(middleware);
  }

  useBuiltin (midd, ...opts) {
    this.app.useBuiltin(midd, ...opts);
  }

  viewEngine (engine, folder = 'views') {
    this.app.viewEngine(engine, folder);
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
    this.createServer();
//     this.server = this.app.server;
// 
//     this.server.on("upgrade", (request, socket, head) => {
//       if (this.sockets) {
//         this.sockets.handleUpgrade(request, socket, head, (ws) => {
//           this.sockets.emit("connection", ws, request);
//         });
//       } else {
//         socket.destroy();
//       }
//     });

    this.app.listen(port, callback);
  }
}
