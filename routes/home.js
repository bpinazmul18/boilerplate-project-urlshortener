const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

module.exports = router;
