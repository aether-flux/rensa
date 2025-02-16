import { RevApp } from "../src/index.js";

const app = new RevApp();

app.use((req, res, next) => {
  console.log("Middleware 1");
  next();
})

app.use((req, res, next) => {
  console.log("Middleware 2");
  next();
})

app.get("/test", (req, res) => {
  console.log("Hello Ascent.js!!");
  res.send("Hello Ascent!");
})

app.get("/midtest", (req, res, next) => {
  console.log("Route middleware 1");
  next();
}, (req, res, next) => {
    console.log("Route middleware 2");
    next();
}, (req, res) => {
    console.log("New midtest route");
    res.send("Midtest route");
})

app.listen(3000, () => {
  console.log("Server started on port 3000...");
})
