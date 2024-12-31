const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSalarySchema = new Schema(
  {
    NIC: {
      type: String,
      ref: "Employee", // reference to 'Employee'
      required: true,
    },
    Month: {
      type: Date,
      required: true,
    },
    BasicSalary: {
      type: Number,
      required: true,
    },
    OTRate: {
      type: Number,
    },
    OTHours: {
      type: Number,
    },
    Bonus: {
      type: Number,
      required: true,
    },
    TotalSalary: {
      type: Number,
      required: true,
    },
    // Payment details
    PaymentDetails: {
      transactionid: {
        type: String,
        required: true,
      },
      paymentDate: {
        type: Date,
        default: Date.now,
      },
      paymentStatus: {
        type: String,
        default: "Pending",
      },
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeSalary = mongoose.model("EmployeeSalary", employeeSalarySchema);
module.exports = EmployeeSalary;
