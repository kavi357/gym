const mongoose = require("mongoose");

const supplementsSchema = mongoose.Schema(
  {
    productname: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const supplementsModel = mongoose.model("supplements", supplementsSchema);

module.exports = supplementsModel;
