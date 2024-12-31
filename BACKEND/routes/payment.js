const router = require("express").Router();
const moment = require("moment");
let SalaryPayModel = require("../models/SalaryPayment");
let Employee = require("../models/empModel");
let employeeSalaries = require("../models/empSalary");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51OjYK2GjGllflNaTyKeZ71glyYqU23z2N9WkaftW1a98JAfgVvOb8U2jfupL1UAue4uVqAh3cGBlOIkE8ikIqNPu00wRUHAEAg"
);

router.post("/salaryPay", async (req, res) => {
  try {
    const { employee_id, email, amount, token } = req.body;

    console.log(employee_id);
    console.log(email);

    console.log(amount);
    // console.log("token.id", token.id);

    // console.log("Hello Thilakshana");
    // console.log("in backend function ", req.body);

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    console.log(customer.id);
    const payment = await stripe.charges.create(
      {
        amount: amount * 100,
        customer: customer.id,
        currency: "LKR",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    console.log(
      "payment object ",
      typeof payment.payment_method_details.card.exp_month,
      typeof payment.payment_method_details.card.exp_year
    );
    //console.log("Date", new Date().toLocaleDateString());

    if (payment) {
      const newPaymentDetails = {
        employee_id,
        paid_date: new Date().toLocaleDateString(),
        email,
        amount,
        salary_year: payment.payment_method_details.card.exp_year,
        salary_month: payment.payment_method_details.card.exp_month,
      };

      await SalaryPayModel.create(newPaymentDetails);

      return res
        .status(200)
        .json({ message: "Payment successfully completed" });
    } else {
      return res
        .status(400)
        .json({ error: "Hello Thilakshana Payment failed" });
    }
  } catch (error) {
    return res.status(345).json({ error: error.message });
  }
});

module.exports = router;
