const router = require("express").Router();
let Other = require("../models/Other");

router.route("/add").post((req, res) => {
  const title = req.body.title;
  const fname = req.body.fname;
  const email = req.body.email;
  const msg = req.body.msg;

  const newOther = new Other({
    title,
    fname,
    email,
    msg,
  });

  newOther
    .save()
    .then(() => {
      res.json("Contact Added");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/").get((req, res) => {
  Other.find()
    .then((others) => {
      res.json(others);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/update/:id").put(async (req, res) => {
  let userId = req.params.id;
  const { title, fname, email, msg } = req.body;

  const updateOther = {
    title,
    fname,
    email,
    msg,
  };

  const update = await Other.findByIdAndUpdate(userId, updateOther)
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

  await Other.findByIdAndDelete(userId)
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

  const user = await Other.findById(userId)
    .then((Other) => {
      res.status(200).send({ status: "User fetched", Other });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get user", error: err.message });
    });
});

module.exports = router;
