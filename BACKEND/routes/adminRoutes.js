const express = require("express");

// const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllFitnessConsultantController,
  changeAccountStatusController,
  deleteFitnessConsultantController,
} = require("../controllers/adminCtrl");

// Router object
const router = express.Router();

// get methods || users

router.get("/getAllUsers", getAllUsersController);

// get methods || fitness consultants

router.get(
  "/getAllFitnessConsultants",

  getAllFitnessConsultantController
);

// POST Account Status

router.post(
  "/changeAccountStatus",

  changeAccountStatusController
);

//POST delete fitness consultant

router.post(
  "/deleteFitnessConsultant",

  deleteFitnessConsultantController
);

module.exports = router;
