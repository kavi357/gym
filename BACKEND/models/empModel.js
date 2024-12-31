const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    password: {
      type: String,
      default: "Sliit@123",
    },
    FirstName: {
      type: String,
      required: [true, "First name is required."],
    },
    LastName: {
      type: String,
      required: [true, "Last name is required."],
    },
    NIC: {
      type: String,
      required: [true, "NIC is required."],
      unique: [true, "NIC is already exists"],
    },
    Role: {
      type: String,
      required: [true, "Role is required."],
    },
    Gender: {
      type: String,
      required: false,
    },
    DOB: {
      type: Date,
      required: false,
    },
    ContactNo: {
      type: String,
      validate: {
        validator: function (value) {
          return /^\d{9}$/.test(value); // Assuming 10-digit phone number
        },
        message: "Invalid phone number.",
      },
    },
    Email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: {
        validator: function (value) {
          // Basic email format validation
          return /\S+@\S+\.\S+/.test(value);
        },
        message: "Invalid email format.",
      },
    },
    notification: {
      type: Array,
      default: [],
    },
    seennotification: {
      type: Array,
      default: [],
    },
    Address: {
      type: String,
      required: false,
    },
    JoinedDate: {
      type: Date,
      required: false,
    },
    salaryDetails: {
      Month: {
        type: Date,
        default: Date.now,
      },
      BasicSalary: {
        type: Number,
        default: 0,
      },
      OTRate: {
        type: Number,
        default: 0,
      },
      OTHours: {
        type: Number,
        default: 0,
      },
      Bonus: {
        type: Number,
        default: 0,
      },
      TotalSalary: {
        type: Number,
        default: 0,
      },
    },
    Attendence: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendence" }],
    EmpSalary: [
      { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeSalary" },
    ],
    Leave: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }],
    EmployeeProfile: [
      { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeProfile" },
    ],
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
