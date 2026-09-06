require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const LinkRoutes = require("./routes/linkRoutes");
const FirstShortUrl = require("./routes/firstShortUrlRoutes");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.redirect(process.env.CLIENT_URL);
});
app.head("/health", (req, res) => {
  console.log("Health Checked");
  res.status(200).end();
});
app.use("/", FirstShortUrl);
app.use("/", LinkRoutes);

module.exports = app;
