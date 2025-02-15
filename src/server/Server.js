import http from "http";
import { Router } from "../routes/Routes.js";
import { URLSearchParams } from "url";

export class Server {
  constructor () {
    this.router = new Router();
  }

  get (path, handler) {
    this.router.add("GET", path, handler);
  }

  post (path, handler) {
    this.router.add("POST", path, handler);
  }

  put (path, handler) {
    this.router.add("PUT", path, handler);
  }

  patch (path, handler) {
    this.router.add("PATCH", path, handler);
  }

  delete (path, handler) {
    this.router.add("DELETE", path, handler);
  }

  listen (port, callback = () => {}) {
    const server = http.createServer((req, res) => {
      // Custom res.send() function
      res.send = (data) => {
        if (typeof data === 'object') {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        } else {
          res.end(data);
        }
      };

      // Handling executing routes
      const method = req.method;
      const path = req.url.split('?')[0];

      // Handling req.body manually
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        if (body) {
          let contentType = req.headers["content-type"];

          if (contentType === "application/json") {
            req.body = JSON.parse(body);
          } else if (contentType === "application/x-www-form-urlencoded") {
            req.body = Object.fromEntries(new URLSearchParams(body));
          } else {
            req.body = body;
          }
        } else {
          req.body = {};
        }

        this.router.handle(method, path, req, res);
      })
    });

    server.listen(port, () => {
        console.log("Server js started.");
        callback();
    });
  }
}
