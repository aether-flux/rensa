import http from "http";
import { Router } from "../routes/Routes.js";

const router = new Router();

router.add("GET", "/user/:id", (params) => {
  console.log("User ID:", params.id);
})

router.add("GET", "/post/:slug", (params) => {
  console.log("Post Slug:", params.slug);
})

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split('?')[0];

  try {
    router.handle(method, path);

    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.end("Matched route found.");
  } catch (e) {
//     res.status(404);
//     res.end("Not found.");
    console.error(e);
  }

});

server.listen(3000, () => {
  console.log("Server started on port 3000...");
})
