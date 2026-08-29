const { urlencoded } = require("express");
const FirstShortUrl = require("../models/FirstShortUrl");

const firstShortUrlClick = async (req, res) => {
  const { shortCode } = req.params;

  if (!shortCode)
    return res.status(400).json({ status: false, message: "Bad request!" });

  try {
    const url = await FirstShortUrl.findOne({ shortCode });

    if (!url)
      return res.status(404).json({ status: false, message: "URL not found!" });

    return res.redirect(url.destinationUrl);
  } catch (error) {}

  return res
    .status(200)
    .json({ status: false, message: "Internal server error!" });
};

module.exports = {
  firstShortUrlClick,
};
