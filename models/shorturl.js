const mongoose = require("mongoose");

const Url = new mongoose.model(
  "Url",
  new mongoose.Schema({
    original_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: Number,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

module.exports.Url = Url;
