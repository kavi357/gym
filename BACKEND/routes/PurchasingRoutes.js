const express = require("express");
const router = express.Router();
const Purchasing = require("../models/Purchasing");
const Package = require("../models/Package");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51OhaBvIyaC49rhuEk1vCPpcZvDEaz5QWyFKybSNwxvWf4NaHP7koiJqyaaUWQwmOftLrja7ZWgOVVHRkDkFn2kd5002xryrwOE"
);

router.post("/purchasePackageItem", async (req, res) => {
  try {
    const {
      packageItem,
      userEmail,
      fromdate,
      todate,
      totalAmount,
      totalDays,
      token,
    } = req.body;

    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const payment = await stripe.charges.create(
        {
          amount: totalAmount * 100,
          customer: customer.id,
          currency: "lkr",
          receipt_email: token.email,
        },
        {
          idempotencyKey: uuidv4(),
        }
      );

      if (payment) {
        const newpurchasing = new Purchasing({
          packageItem: packageItem,
          packageItemid: packageItem._id,
          userEmail,
          fromdate,
          todate,
          totalAmount,
          totalDays,
          transactionid: payment.id, // Using Stripe payment ID
        });

        const purchasing = await newpurchasing.save();
        return res
          .status(200)
          .json({ message: "Package purchased successfully" });
      } else {
        return res.status(400).json({ error: "Payment failed" });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/getpurchingsbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const purchasing = await Purchasing.find({ userid: userid });
    res.send(purchasing);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/cancelpurchasing", async (req, res) => {
  const { purchasingsid, packageItemid } = req.body;

  console.log(purchasingsid);
  console.log(packageItemid);

  try {
    const purchasingsitem = await Purchasing.findOne({ _id: purchasingsid });

    if (!purchasingsitem) {
      return res.status(404).json({ error: "Purchasing item not found" });
    }

    purchasingsitem.status = "cancelled";
    await purchasingsitem.save();

    const packageItem = await Package.findOne({ _id: packageItemid });

    console.log(packageItem);

    if (!packageItem) {
      return res.status(404).json({ error: "Package item not found" });
    }

    console.log(packageItem.currentbookings);

    packageItem.currentpurchasings = packageItem.currentbookings.filter(
      (purchasings) => purchasings.purchasingsid.toString() !== purchasingsid
    );

    await packageItem.save();

    return res
      .status(200)
      .json({ message: "Your purchasing was successfully cancelled" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getallpurchasing", async (req, res) => {
  try {
    const purchasings = await Purchasing.find();
    res.send(purchasings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
