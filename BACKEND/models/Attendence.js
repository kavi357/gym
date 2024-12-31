const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendenceSchema = new Schema(
  {
    NIC: {
      type: String,
      required: [true, "NIC is required."],
    },
    AttendenceDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    IsAttend: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Attendence = mongoose.model("Attendence", AttendenceSchema);
module.exports = Attendence;
