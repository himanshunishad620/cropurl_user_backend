const mongoose = require("mongoose");

const QRAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  totalScans: {
    type: Number,
    default: 0,
  },

  totalClicks: {
    type: Number,
    default: 0,
  },

  uniqueClicks: {
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
  browser: {
    type: Map,
    of: {
      type: Number,
      default: 0,
    },
    default: {},
  },
});

const QRAnalytics = mongoose.model("QRAnalytics", QRAnalyticsSchema);
module.exports = QRAnalytics;
