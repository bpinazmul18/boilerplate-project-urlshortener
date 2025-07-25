require("dotenv").config();
const winston = require("winston");
const express = require("express");
const cors = require("cors");
const app = express();

const { Url, validate } = require("./models/shorturl");

require("./startup/logging")(app);
// require("./startup/routes")(app);
require("./startup/db")();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", async (req, res) => {
  // Validate input field
  const { error, value } = validate({ original_url: req.body?.url });

  if (error) return res.json({ error: "invalid url" });

  // Find by url and return
  // const url = await Url.findOne({ original_url: value.original_url });

  // if (url) {
  //   return res.json({
  //     original_url: url.original_url,
  //     short_url: url.short_url,
  //   });
  // }

  const count = await Url.countDocuments({});

  // New url
  const newUrl = new Url({
    original_url: value.original_url,
    short_url: count + 1,
  });

  const _newUrl = await newUrl.save();

  return res.json({
    original_url: _newUrl.original_url,
    short_url: _newUrl.short_url,
  });
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const short_url = req.params.short_url;

  try {
    const url = await Url.findOne({ short_url });

    if (!url) {
      return res.status(404).json({ error: "URL was not found" });
    }

    return res.redirect(url.original_url);
  } catch (err) {
    winston.error("Error retrieving URL:", err);
    return res.status(500).json({ error: "Error retrieving URL" });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  winston.info(`Listening on port ${port}`);
});
