const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OthertSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

const Other = mongoose.model("Other", OthertSchema);
module.exports = Other;
