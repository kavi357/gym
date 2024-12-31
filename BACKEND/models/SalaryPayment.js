const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalaryPaymentSchema = new Schema({
  employee_id: {
    type: String,
    ref: "Employee", // reference to 'Employee'
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
  },

  paid_date: {
    type: Date,
  },

  salary_month: {
    type: Number,
    required: true,
  },

  salary_year: {
    type: Number,
    required: true,
  },
});

const SalaryPayment = mongoose.model("salarypayment", SalaryPaymentSchema);
module.exports = SalaryPayment;
