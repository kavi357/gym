const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    imageurls: [],

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

const classModel = mongoose.model("classes", classSchema);

module.exports = classModel;
