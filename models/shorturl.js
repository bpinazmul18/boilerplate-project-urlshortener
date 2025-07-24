const Joi = require("joi");
const mongoose = require("mongoose");

const Url = new mongoose.model(
  "Url",
  new mongoose.Schema({
    original_url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          const urlRegex = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([/#?].*)?$/;
          return urlRegex.test(value);
        },
        message: "Invalid URL format",
      },
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

function validateUrl(url) {
  const schema = Joi.object({
    original_url: Joi.string().uri().required().label("Original URL"),
  });

  return schema.validate(url);
}

module.exports.Url = Url;
module.exports.validate = validateUrl;
