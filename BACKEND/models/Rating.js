const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  supplement: {
    type: String, // Field for selected supplement name
  },
  trainer: {
    type: String, // Field for selected trainer name
  },
  equipment: {
    type: String, // Field for selected equipment name
  },
  other: {
    type: String, // Field for other title
  },
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
