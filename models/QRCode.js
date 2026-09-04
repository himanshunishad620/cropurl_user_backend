const mongoose = require("mongoose");

const QRCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    totalEngagement: {
      type: Number,
      required: true,
      default: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    destinationUrl: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    imgUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
const QRCode = mongoose.model("QRCode", QRCodeSchema);
module.exports = QRCode;
