import http from "http";
import gpath from "path";
import fs from 'fs';
import mime from 'mime';
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
    if (!this.server) this.createServer();
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

  viewEngine (engine, folder = 'views') {
    this.renderEngine = engine;
    this.renderFolder = gpath.resolve(folder);
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

  createServer () {
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

      // Custom res.json() function
      res.json = (obj) => {
        if (typeof obj !== "object") return;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
      }

      // Custom res.redirect() function
      res.redirect = (url, statusCode = 302) => {
        res.writeHead(statusCode, {Location: url});
        res.end();
      }

      // Custom res.status() function
      res.status = function (code) {
        this.statusCode = code;
        return this;
      }

      // Custom res.sendFile() function
      res.sendFile = (filePath) => {
        const absPath = gpath.resolve(filePath);

        if (!fs.existsSync(absPath)) {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end("File not found.");
          return;
        }

        const contentType = mime.getType(absPath) || 'application/octet-stream';

        res.writeHead(200, {'Content-Type': contentType});

        const fileStream = fs.createReadStream(absPath);
        fileStream.pipe(res);
      }

      // Custom res.render() function
      res.render = async (view, data = {}) => {
        if (!this.renderEngine) throw new Error("View Engine is not set. Use app.viewEngine(engine <, folder>)");

        const filePath = gpath.join(this.renderFolder, `${view}.${this.renderEngine}`);

        if (this.renderEngine === 'ejs') {
          const {renderEjs} = await import('../utils/render/handleEjs.js');
          renderEjs(filePath, data, (err, html) => {
            if (err) {
              res.writeHead(500, {"Content-Type": "text/plain"});
              return res.end("Error rendering view.");
            }

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
          })
        }
      }

      // Custom req.get function
      req.get = function (headerName) {
        return this.headers[headerName.toLowerCase()] || null;
      }

      // Custom req.protocol function
      Object.defineProperty(req, "protocol", {
        get() {
            return this.headers["x-forwarded-proto"] || (this.connection.encrypted ? "https" : "http");
        }
      });


      // Handling executing routes
      const method = req.method;
      const path = req.url.split('?')[0];

      // Handling req.body manually
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
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

        await this.router.handle(method, path, req, res);
      })
    });

    this.server = server;

  }

  listen (port, callback = () => {}) {
    this.createServer();

    this.server.listen(port, () => {
        callback();
    });
  }
}
