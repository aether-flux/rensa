import { Router } from "./routes/Routes.js";

const app = new Router();

app.add('GET', '/user/:id', (params) => {
  console.log('User ID:', params.id);
})

app.add('GET', '/post/:slug', (params) => {
  console.log('Post slug:', params.slug);
})

app.handle("GET", "/user/42");
app.handle("GET", "/post/firstpost");
