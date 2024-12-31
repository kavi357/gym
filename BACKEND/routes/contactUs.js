const router = require("express").Router();
let ContactUs = require("../models/ContactUs");

router.route("/add").post((req, res) => {
  const fullname = req.body.fullname;
  const phone = req.body.phone;
  const email = req.body.email;
  const msg = req.body.msg;

  console.log("in contact us backend");

  const newContactUs = new ContactUs({
    fullname,
    phone,
    email,
    msg,
  });

  newContactUs
    .save()
    .then(() => {
      res.json("ContactUs Added");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/").get((req, res) => {
  ContactUs.find()
    .then((contactUss) => {
      res.json(contactUss);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/update/:id").put(async (req, res) => {
  let userId = req.params.id;
  const { fullname, phone, email, msg } = req.body;

  const updateContactUs = {
    fullname,
    phone,
    email,
    msg,
  };

  const update = await ContactUs.findByIdAndUpdate(userId, updateContactUs)
    .then(() => {
      res.status(200).send({ status: "User updated" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ status: "Error with updating data", error: err.message });
    });
});

router.route("/delete/:id").delete(async (req, res) => {
  let userId = req.params.id;

  await ContactUs.findByIdAndDelete(userId)
    .then(() => {
      res.status(200).send({ status: "User Deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with delete user", error: err.message });
    });
});

router.route("/get/:id").get(async (req, res) => {
  let userId = req.params.id;

  const user = await ContactUs.findById(userId)
    .then((contactUs) => {
      res.status(200).send({ status: "User fetched", contactUs });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get user", error: err.message });
    });
});

module.exports = router;
