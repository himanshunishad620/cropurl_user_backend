const mongoose = require("mongoose");
const firstShortUrlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  destinationUrl: {
    type: String,
    required: true,
  },
});
const FirstShortUrl = mongoose.model("FirstShortUrl", firstShortUrlSchema);
module.exports = FirstShortUrl;
