const express = require("express");
const helmet = require("helmet");
//const dotenv = require('dotenv').config();
const path = require("path");
const userRoutes = require("./routes/user");
//const messageRoutes = require("./routes/message");
//const likeRoutes = require("./routes/like");

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/", userRoutes);
//app.use("/api/", messageRoutes);
//app.use("/api/", likeRoutes);

module.exports = app;
