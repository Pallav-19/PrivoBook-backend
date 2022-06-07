require("dotenv").config();
const db = require("./db.config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080 || process.env.PORT;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
db();
app.get("/", (req, res, next) => {
  res.send("Welcome to iNotebook");
  next();
});
const authRoutes = require("./routes/auth.js");
app.use("/api/auth", authRoutes);
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});
