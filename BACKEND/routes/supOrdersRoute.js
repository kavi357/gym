const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51OiwRjKyzCUkZc5ANkP1kLTybbyBR7n536oMl3ViEypM9ulWDrDnm1gvCiUaDt4SAvCzNh02RPKpcxJroIHSc2PN00x1UiTM6z"
);
const Order = require("../models/orderModel");
router.post("/placeOrder", async (req, res) => {
  const { token, subtotal, cartItems } = req.body; //,currentUser
  console.log("Received cartItems:", cartItems);

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: subtotal * 100,
        currency: "LKR",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(), //unique request id to avoid duplication
      }
    );

    if (payment) {
      const neworder = new Order({
        //name: currentUser.name,
        //email: currentUser.email,
        //userid: currentUser._id,
        orderItems: cartItems,
        orderAmount: subtotal,
        shippingAddress: {
          street: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          pincode: token.card.address_zip,
        },
        transactionId: payment.source.id,
      });

      neworder.save();

      res.send("Order placed successfully");
    } else {
      res.send("Payment Failed");
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.post("/getuserorders", async (req, res) => {
  const { userid } = req.body;
  try {
    const orders = await Order.find({ userid: userid }).sort({ createdAt: -1 });
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = router;
