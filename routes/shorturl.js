const express = require("express");
const router = express.Router();

// My first API endpoint
router.get("/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

module.exports = router;
