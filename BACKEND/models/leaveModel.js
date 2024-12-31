const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema(
  {
    leaveId: {
      type: String,
      required: true,
      unique: [true, "Leave ID is already exists"],
    },

    NIC: {
      type: String,
      required: [true, "NIC is required."],
      //unique: [true, "NIC is already exists"],
      ref: "Employee", // Reference the Employee model
    },

    LeaveType: {
      type: String,
      required: true,
    },

    LeaveFrom: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // Ensure LeaveFrom is before or equal to LeaveTo
          return value <= this.LeaveTo;
        },
        message: "LeaveFrom must be before or equal to LeaveTo",
      },
    },

    LeaveTo: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Manually increment leaveId before saving
leaveSchema.pre("save", async function (next) {
  try {
    if (!this.leaveId) {
      const highestLeaveId = await this.constructor
        .findOne()
        .sort({ leaveId: -1 })
        .select({ leaveId: 1 })
        .lean();

      this.leaveId = highestLeaveId ? highestLeaveId.leaveId + 1 : 1;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
