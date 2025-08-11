const express = require("express");
const router = express.Router();
const dns = require("dns");
const { Url } = require("../models/shorturl");
// My first API endpoint
router.get("/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// Short URL creation endpoint
router.post("/shorturl", function (req, res) {
  const originalUrl = req.body.url;
  if (!originalUrl) return res.json({ error: "invalid url" });

  let hostname;
  try {
    const parsed = new URL(originalUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.json({ error: "invalid url" });
    }
    hostname = parsed.hostname;
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(hostname, async (dnsErr) => {
    if (dnsErr) {
      return res.json({ error: "invalid url" });
    }

    try {
      // If URL already exists, return existing document
      let found = await Url.findOne({ original_url: originalUrl });
      if (found) {
        return res.json({
          original_url: found.original_url,
          short_url: found.short_url,
        });
      }

      // Create a new short_url (simple auto-increment: find max and +1)
      const last = await Url.findOne().sort({ short_url: -1 }).exec();
      const nextShort = last ? last.short_url + 1 : 1;

      const newUrl = new Url({
        original_url: originalUrl,
        short_url: nextShort,
      });

      // Save the new URL document
      await newUrl.save();

      return res.json({
        original_url: newUrl.original_url,
        short_url: newUrl.short_url,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  });
});

module.exports = router;
