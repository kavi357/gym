const mongoose = require("mongoose");

const purchasingSchema = mongoose.Schema(
  {
    packageItem: {
      type: String,
      required: true,
    },

    packageItemid: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },

    fromdate: {
      type: String,
      required: true,
    },

    todate: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
    },

    transactionid: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      default: "purchased",
    },
  },
  {
    timestamps: true,
  }
);

const purchasingmodel = mongoose.model("purchasing", purchasingSchema);

module.exports = purchasingmodel;
