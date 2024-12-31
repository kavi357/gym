const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrainerSchema = new Schema({
  fname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  trainer: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

const Trainer = mongoose.model("Trainer", TrainerSchema);
module.exports = Trainer;
