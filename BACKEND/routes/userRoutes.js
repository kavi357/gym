const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyFitnessConsultant,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllFitnessConsultantsController,
  bookAppointmentController,
  bookAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userCtrl");
// const authMiddleware = require("../middlewares/authMiddleware");

// Router object
const router = express.Router();

// Routes

// LOGIN || POST
router.post("/login", loginController);

// REGISTER || POST
router.post("/register", registerController);

// Auth || POST
router.post("/getUserData", authController);

// Apply Fitness Consultant || POST
router.post(
  "/apply-fitness-consultant",

  applyFitnessConsultant
);

// Notification Fitness Consultant || POST
router.post(
  "/get-all-notification",

  getAllNotificationController
);

// Notification Fitness Consultant || POST
router.post(
  "/delete-all-notification",

  deleteAllNotificationController
);

// Get all fitness consultants
router.get(
  "/getAllFitnessConsultants",

  getAllFitnessConsultantsController
);

//BOOK APPOINTMENT
router.post("/book-appointment", bookAppointmentController);

//Booking Avilability
router.post("/book-availability", bookAvailabilityController);

//Appointment list
router.get("/user-appointments", userAppointmentsController);

module.exports = router;
