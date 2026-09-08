require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const LinkRoutes = require("./routes/linkRoutes");
const FirstShortUrl = require("./routes/firstShortUrlRoutes");
const app = express();

app.use(express.json());
app.use(cors());
app.set("trust proxy", true);
app.use(cookieParser());
app.head("/health/check", (req, res) => {
  console.log("Health Checked");
  return res.sendStatus(200);
});
app.get("/test", (req, res) => {
  console.log("req.ip:", req.ip);
  console.log("req.ips:", req.ips);
  console.log("x-forwarded-for:", req.headers["x-forwarded-for"]);
  console.log("x-real-ip:", req.headers["x-real-ip"]);

  res.json({
    ip: req.ip,
    ips: req.ips,
    forwardedFor: req.headers["x-forwarded-for"],
    realIp: req.headers["x-real-ip"],
  });
});

app.get("/", (req, res) => {
  res.redirect(process.env.CLIENT_URL);
});
app.use("/", FirstShortUrl);
app.use("/", LinkRoutes);

module.exports = app;
