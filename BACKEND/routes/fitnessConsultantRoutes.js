const express = require("express");
// const authMiddleware = require("../middlewares/authMiddleware");
const {
  getFitnessConsultantInfoController,
  updateProfileController,
  getFitnessConsultantByIdController,
  fitnessConsultantAppointmentsController,
  updateStatusController,
} = require("../controllers/fitnessConsultantCtrl");
const router = express.Router();

// POST single FC info
router.post(
  "/getFitnessConsultantInfo",

  getFitnessConsultantInfoController
);

// POST update profile
router.post("/updateProfile", updateProfileController);

// POST get single fitness consultant
router.post(
  "/getFitnessConsultantById",

  getFitnessConsultantByIdController
);

// GET Appointments
router.get(
  "/fitness-consultant-appointments",

  fitnessConsultantAppointmentsController
);

// POST Update Status
router.post("/update-status", updateStatusController);

module.exports = router;
