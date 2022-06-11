require("dotenv").config();
const db = require("./db.config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080 || process.env.PORT;
const Cors = require("cors");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
db();
app.get("/", (req, res, next) => {
  res.send("Welcome to iNotebook");
  next();
});
app.use(Cors());

const authRoutes = require("./routes/auth.js");
app.use("/api/auth", authRoutes);
const noteRoutes = require("./routes/notes.js");
app.use("/api/note/", noteRoutes);
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});
