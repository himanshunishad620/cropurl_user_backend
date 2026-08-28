const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  shortCodes: {
    type: [String],
    default: [],
  },
});

const Visitor = mongoose.model("Visitor", visitorSchema);
module.exports = Visitor;
