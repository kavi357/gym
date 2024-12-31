const router = require("express").Router();
const Rating = require("../models/Rating");

router.route("/add").post((req, res) => {
  const {
    title,
    description,
    stars,
    createdAt,
    supplement,
    trainer,
    equipment,
    other,
  } = req.body;

  const newRating = new Rating({
    title,
    description,
    stars,
    createdAt,
    supplement,
    trainer,
    equipment,
    other,
  });

  newRating
    .save()
    .then(() => {
      res.status(201).json("Rating Added");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json("Error adding rating");
    });
});

router.route("/").get((req, res) => {
  Rating.find()
    .then((ratings) => {
      res.json(ratings);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json("Error getting ratings");
    });
});

router.route("/update/:id").put(async (req, res) => {
  let id = req.params.id;
  const { title, createdAt, description } = req.body;

  const updateRating = {
    title,
    createdAt,
    description,
  };

  try {
    await Rating.findByIdAndUpdate(id, updateRating);
    res.status(200).send({ status: "Rating Updated!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ status: "Can not update the review", error: err.message });
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  let id = req.params.id;

  try {
    await Rating.findByIdAndDelete(id);
    res.status(200).send({ status: "Rating deleted" });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .send({ status: "Error with deleting the review", error: err.message });
  }
});

router.route("/get/:id").get(async (req, res) => {
  let id = req.params.id;

  try {
    const rating = await Rating.findById(id);
    res.status(200).send({ status: "Rating fetched", rating });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .send({ status: "Error with getting the review", error: err.message });
  }
});

module.exports = router;
