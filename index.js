require("dotenv").config();
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")(app);
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 3000;

app.listen(port, function () {
  winston.info(`Listening on port ${port}`);
});
