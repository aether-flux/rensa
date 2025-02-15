import { Server } from "./server/Server.js";

const app = new Server();

app.get("/test", (req, res) => {
  console.log("Hello Ascent.js!!");
  res.send("Hello Ascent!");
})

app.post("/test", (req, res) => {
  console.log("Username: ", req.body.username);
  console.log("Password: ", req.body.pswd);
})

app.put("/test", (req, res) => {
  console.log("Username: ", req.body.username);
  console.log("Password: ", req.body.pswd);
})

app.patch("/test", (req, res) => {
  console.log("Username: ", req.body.username);
  console.log("Password: ", req.body.pswd);
})

app.delete("/test", (req, res) => {
  console.log("Username: ", req.body.username);
  console.log("Password: ", req.body.pswd);
})


app.listen(3000, () => {
  console.log("Server started on port 3000...");
})
