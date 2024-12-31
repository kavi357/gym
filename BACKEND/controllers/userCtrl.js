const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fitnessConsultantModel = require("../models/fitnessConsultantModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const empModel = require("../models/empModel");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exists", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).send({ message: error.message, success: false });
    }
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(200)
        .send({ message: "User not Found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error in Login Controller ${error.message}`,
      success: false,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.password = undefined;

    if (!user) {
      return res
        .status(200)
        .send({ message: "User not Found", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth error",
      success: false,
      error,
    });
  }
};

const applyFitnessConsultant = async (req, res) => {
  console, log("in applyFitnessConsultant backend");
  try {
    const newFitnessConsultant = await fitnessConsultantModel({
      ...req.body,
      status: "pending",
    });
    await newFitnessConsultant.save();
    const adiminUser = await empModel.findOne({
      role: "fitness consultant manager",
    });
    const notification = adiminUser.notification;
    notification.push({
      type: "apply-consultant-request",
      message: `${newFitnessConsultant.firstName} ${newFitnessConsultant.lastName} Has Applied For A Fitness Consultant Account`,
      data: {
        fitnessConsultantId: newFitnessConsultant._id,
        name:
          newFitnessConsultant.firstName + " " + newFitnessConsultant.lastName,
        onClickPath: "/admin/fitness-consultant",
      },
    });
    await userModel.findByIdAndUpdate(adiminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Fitness Consultant Acoount Apply Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying for Fitness Consultant",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not Found", success: false });
    }
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All Notification Marked as Read",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Notification",
      success: false,
      error,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updateUser = await user.save();
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notification Deleted Successfully",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to Delete All Notification",
      error,
    });
  }
};

const getAllFitnessConsultantsController = async (req, res) => {
  try {
    const fitnessConsultants = await fitnessConsultantModel.find({
      status: "approved",
    });
    res.status(200).send({
      success: true,
      message: "Fitness Consultant Lists Fetched Successfully",
      data: fitnessConsultants,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Fitness Consultant",
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({
      _id: req.body.fitnessConsultantInfo.userId,
    });
    user.notification.push({
      type: "New-appointment-request",
      message: `A New Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Appointment",
    });
  }
};

const bookAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();

    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const fitnessConsultantId = req.body.fitnessConsultantId;

    const appointments = await appointmentModel.find({
      fitnessConsultantId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Available at this time",
        success: true,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Appointments Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully!",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
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
};
