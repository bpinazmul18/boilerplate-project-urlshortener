require("dotenv").config();
const express = require("express");
const app = express();

require("./startup/logging")(app);
require("./startup/routes")(app);
require("./startup/db")();

// Basic Configuration
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
