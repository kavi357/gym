const express = require("express");

// controller functions

const {
  signupUser,
  loginUser,
  applyFitnessConsultant,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

router.post("/apply-fitness-consultant", applyFitnessConsultant);

module.exports = router;
