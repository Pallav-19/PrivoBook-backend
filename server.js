require("dotenv").config();
const db = require("./db.config");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const Cors = require("cors");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
db();
app.use(Cors());
app.use("/", express.static(path.join(__dirname, "react")));

const authRoutes = require("./routes/auth.js");
app.use("/api/auth/", authRoutes);
const noteRoutes = require("./routes/notes.js");
app.use("/api/note/", noteRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "react", "index.html"));
  next();
});
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});
