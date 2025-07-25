const mongoose = require("mongoose");

const Url = new mongoose.model(
  "Url",
  new mongoose.Schema({
    original_url: {
      type: String,
    },
    short_url: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

module.exports.Url = Url;
