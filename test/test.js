import { RevApp } from "../src/index.js";

const app = new RevApp();

// app.use((req, res, next) => {
//   console.log("Middleware 1");
//   next();
// })

// app.useBuiltin("cors");
// app.useBuiltin("sessions");

app.get("/test", (req, res) => {
  console.log("Hello Ascent.js!!");
  res.send("Hello Ascent!");
})

app.get("/midtest", (req, res) => {
    console.log("New midtest route");
    res.send("Midtest route");
})

app.listen(3000, () => {
  console.log("Server started on port 3000...");
})
