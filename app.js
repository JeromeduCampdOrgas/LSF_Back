const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const refugeRoutes = require("./routes/refuge");
const chiensRoutes = require("./routes/chien");
const searchRoutes = require("./routes/search");

const app = express();

app.use(helmet());
app.use(bodyParser.json());

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
app.use("/api/", adminRoutes);
app.use("/api/", refugeRoutes);
app.use("/api/", chiensRoutes);
app.use("/api/", searchRoutes);

module.exports = app;
