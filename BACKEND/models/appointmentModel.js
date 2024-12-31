const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fitnessConsultantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FitnessConsultant",
      required: true,
    },
    fitnessConsultantInfo: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    userInfo: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AppointmentModel = mongoose.model("appointments", appointmentSchema);
module.exports = AppointmentModel;
