const router = require("express").Router();
let Contact = require("../models/Contact");

router.route("/add").post((req, res) => {
  const fname = req.body.fname;
  const email = req.body.email;
  const msg = req.body.msg;

  const newContact = new Contact({
    fname,
    email,
    msg,
  });

  newContact
    .save()
    .then(() => {
      res.json("Contact Added");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/").get((req, res) => {
  Contact.find()
    .then((contacts) => {
      res.json(contacts);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/update/:id").put(async (req, res) => {
  let userId = req.params.id;
  const { fname, email, msg } = req.body;

  const updateContact = {
    fname,
    email,
    msg,
  };

  const update = await Contact.findByIdAndUpdate(userId, updateContact)
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

  await Contact.findByIdAndDelete(userId)
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

  const user = await Contact.findById(userId)
    .then((contact) => {
      res.status(200).send({ status: "User fetched", contact });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get user", error: err.message });
    });
});

module.exports = router;
