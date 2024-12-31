const mongoose = require("mongoose");

const fitnessConsultantSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },

    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    email: {
      type: String,
      required: [true, "email number is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },

    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },

    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    feesPerConsutation: {
      type: Number,
      required: [true, "fee is required"],
    },

    status: {
      type: String,
      default: "pending",
    },

    timings: {
      type: Object,
      required: [true, "work timing is required"],
    },
  },
  { timestamps: true }
);

const fitnessConsultantModel = mongoose.model(
  "fitness-consultant",
  fitnessConsultantSchema
);
module.exports = fitnessConsultantModel;
