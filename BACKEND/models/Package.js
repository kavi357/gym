const mongoose = require("mongoose");

const packageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    paymentperday: {
      type: Number,
      required: true,
    },

    imageurls: [],

    currentbookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],

    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const packageModel = mongoose.model("packages", packageSchema);

module.exports = packageModel;
