require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const dns = require("node:dns");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static(`${process.cwd()}/public`));

const shortURLSchema = new mongoose.Schema({
  original_url: String,
  short_url: String,
});

const shortURL = mongoose.model("URL", shortURLSchema);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use("/api/shorturl", async (req, res, next) => {
  if (req.method === "POST") {
    if (!req.body.url || req.body.url === null) {
      return res.status(400).send("Bad Request");
    }

    const url = new URL(req.body.url);

    dns.lookup(url.hostname, { family: 4 }, (err, address) => {
      console.log(err);
      console.log(address);
      if (err) return res.json({ error: "invalid url" });
      else next();
    });
  } else {
    next();
  }
});

app.post("/api/shorturl", async (req, res) => {
  const unique_id = nanoid(5);
  const url = new shortURL({
    unique_id,
    original_url: req.body.url,
    short_url: unique_id,
  });

  url.save();
  return res.json({ original_url: req.body.url, short_url: unique_id });
});

// app.get("/api/shorturl/:id", async (req, res) => {
//   const short_url = Number(req.params.id);
//   if (Number.isNaN(short_url)) return res.json({ error: "Wrong format" });

//   const result = await shortURL.findOne({ short_url });

//   if (!result) {
//     return res.json({ error: "not found" });
//   }

//   res.redirect(result.original_url);
// });

app.get("/api/shorturl/:shorturl", async (req, res) => {
  const shortUrl = req.params.shorturl;
  try {
    const found = await shortURL.findOne({ short_url: shortUrl });
    if (found) {
      res.redirect(found.original_url);
    } else {
      res.json({ error: "invalid url" });
    }
  } catch (error) {
    console.error("Error finding document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

mongoose
  .connect(process.env.dbURI)
  .then(() => console.log("MongoDB connection successful!"))
  .catch((err) => console.log(`MongoDB connection failed! ${err}`));

app.listen(port, () => console.log(`Listening on port ${port}`));
