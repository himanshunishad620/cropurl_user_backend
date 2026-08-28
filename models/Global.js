const mongoose = require("mongoose");

const globalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  totalScans: {
    type: Number,
    default: 0,
  },

  totalClicks: {
    type: Number,
    default: 0,
  },

  uniqueVisitors: {
    type: Number,
    default: 0,
  },

  daily: {
    type: Map,
    of: new mongoose.Schema(
      {
        scans: {
          type: Number,
          default: 0,
        },
        clicks: {
          type: Number,
          default: 0,
        },
      },
      { _id: false },
    ),
    default: {},
  },
  cities: {
    type: Map,
    of: {
      type: Number,
      default: 0,
    },
    default: {},
  },
  os: {
    type: Map,
    of: {
      type: Number,
      default: 0,
    },
    default: {},
  },
  browser: {
    type: Map,
    of: {
      type: Number,
      default: 0,
    },
    default: {},
  },
});

const Global = mongoose.model("Global", globalSchema);
module.exports = Global;
