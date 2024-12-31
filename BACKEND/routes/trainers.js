const router = require("express").Router();
let Trainer = require("../models/Trainer");

router.route("/add").post((req, res) => {
  const fname = req.body.fname;
  const email = req.body.email;
  const trainer = req.body.trainer;
  const msg = req.body.msg;

  const newTrainer = new Trainer({
    fname,
    email,
    trainer,
    msg,
  });

  newTrainer
    .save()
    .then(() => {
      res.json("Contact Added");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/").get((req, res) => {
  Trainer.find()
    .then((trainers) => {
      res.json(trainers);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/update/:id").put(async (req, res) => {
  let userId = req.params.id;
  const { fname, email, trainer, msg } = req.body;

  const updateTrainer = {
    fname,
    email,
    trainer,
    msg,
  };

  const update = await Trainer.findByIdAndUpdate(userId, updateTrainer)
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

  await Trainer.findByIdAndDelete(userId)
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

  const user = await Trainer.findById(userId)
    .then((Trainer) => {
      res.status(200).send({ status: "User fetched", Trainer });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get user", error: err.message });
    });
});

module.exports = router;
