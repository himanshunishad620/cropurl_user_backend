const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const LinkRoutes = require("./routes/linkRoutes");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", LinkRoutes);

module.exports = app;
