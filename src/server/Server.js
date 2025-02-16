import http from "http";
import { Router } from "../routes/Routes.js";
import { URLSearchParams } from "url";
import { cors } from "../middlewares/cors.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { logger } from "../middlewares/logger.js";
import { securityHeaders } from "../middlewares/security.js";
import { cookieParser } from "../middlewares/cookies.js";
import { session } from "../middlewares/session.js";

export class Server {
  constructor () {
    this.router = new Router();
  }

  use (middleware) {
    this.router.use(middleware);
  }

  useBuiltin (midd, ...opts) {
    let middleware;
    if (midd === "cors") {
      middleware = cors(...opts);
      this.use(middleware);
      return;
    } else if (midd === "rate limiter") {
      middleware = rateLimit(...opts);
      this.use(middleware);
      return;
    } else if (midd === "request logger") {
      middleware = logger();
      this.use(middleware);
      return;
    } else if (midd === "security") {
      middleware = securityHeaders();
      this.use(middleware);
      return;
    } else if (midd === "cookies") {
      middleware = cookieParser();
      this.use(middleware);
      return;
    } else if (midd === "sessions") {
      middleware = session();
      this.use(middleware);
      return;
    }
  }

  get (path, ...handlers) {
    this.router.add("GET", path, ...handlers);
  }

  post (path, ...handlers) {
    this.router.add("POST", path, ...handlers);
  }

  put (path, ...handlers) {
    this.router.add("PUT", path, ...handlers);
  }

  patch (path, ...handlers) {
    this.router.add("PATCH", path, ...handlers);
  }

  delete (path, ...handlers) {
    this.router.add("DELETE", path, ...handlers);
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
        callback();
    });
  }
}
