const express = require("express");
const cors = require("cors");

const home = require("../routes/home");
const shorturl = require("../routes/shorturl");
const error = require("../middleware/error");

module.exports = function (app) {
  //middleware
  app.use(cors());
  app.use("/public", express.static(`${process.cwd()}/public`));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //routes
  app.use("/", home);
  app.use("/api", shorturl);

  //error
  app.use(error);
};
