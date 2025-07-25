const express = require("express");
const router = express.Router();

const { Url, validate } = require("../models/shorturl");
const winston = require("winston/lib/winston/config");

router.get("/", async (req, res) => {
  return res.send("");
});

router.post("/", async (req, res) => {
  // Validate input field
  const { error, value } = validate({ original_url: req.body?.url });

  if (error) return res.json({ error: "invalid url" });

  // Find by url and return
  const url = await Url.findOne({ original_url: value.original_url });

  if (url) {
    return res.json({
      original_url: url.original_url,
      short_url: url.short_url,
    });
  }

  const count = await Url.countDocuments({});

  console.log({
    original_url: value.original_url,
    short_url: count + 1,
  });

  // New url
  const newUrl = new Url({
    original_url: value.original_url,
    short_url: count + 1,
  });

  await newUrl.save();

  return res.json({
    original_url: newUrl.original_url,
    short_url: newUrl.short_url,
  });
});

router.get("/:id", async (req, res) => {
  const shortUrl = req.params.id;

  try {
    const url = await Url.findOne({ short_url: shortUrl });

    if (!url) {
      return res.status(404).json({ error: "URL was not found" });
    }

    return res.redirect(url.original_url);
  } catch (err) {
    winston.error("Error retrieving URL:", err);
    return res.status(500).json({ error: "Error retrieving URL" });
  }
});

module.exports = router;
