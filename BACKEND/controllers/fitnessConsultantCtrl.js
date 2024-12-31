const fitnessConsultantModel = require("../models/fitnessConsultantModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");

const getFitnessConsultantInfoController = async (req, res) => {
  try {
    const fitnessConsultant = await fitnessConsultantModel.findOne({
      userId: req.body.userId,
    });
    if (!fitnessConsultant) {
      return res.status(404).send({
        success: false,
        message: "Fitness consultant not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Fitness consultant data fetched successfully",
      data: fitnessConsultant,
    });
  } catch (error) {
    console.error("Error in fetching fitness consultant details:", error);
    res.status(500).send({
      success: false,
      message: "Error in fetching fitness consultant details",
      error: error.message,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const { userId } = req.body;
    const fitnessConsultant = await fitnessConsultantModel.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );
    if (!fitnessConsultant) {
      return res.status(404).send({
        success: false,
        message: "Fitness consultant not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Fitness consultant profile updated",
      data: fitnessConsultant,
    });
  } catch (error) {
    console.error("Error in updating fitness consultant profile:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating fitness consultant profile",
      error: error.message,
    });
  }
};

const getFitnessConsultantByIdController = async (req, res) => {
  try {
    const { fitnessConsultantId } = req.body;
    const fitnessConsultant = await fitnessConsultantModel.findById(
      fitnessConsultantId
    );
    if (!fitnessConsultant) {
      return res.status(404).send({
        success: false,
        message: "Fitness consultant not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single fitness consultant info fetched",
      data: fitnessConsultant,
    });
  } catch (error) {
    console.error("Error in fetching single fitness consultant info:", error);
    res.status(500).send({
      success: false,
      message: "Error in fetching single fitness consultant info",
      error: error.message,
    });
  }
};

const fitnessConsultantAppointmentsController = async (req, res) => {
  try {
    const { userId } = req.body;
    const fitnessConsultant = await fitnessConsultantModel.findOne({ userId });
    if (!fitnessConsultant) {
      return res.status(404).send({
        success: false,
        message: "Fitness consultant not found",
      });
    }
    const appointments = await appointmentModel.find({
      fitnessConsultantId: fitnessConsultant._id,
    });
    res.status(200).send({
      success: true,
      message: "Fitness consultant appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error in fetching fitness consultant appointments:", error);
    res.status(500).send({
      success: false,
      message: "Error in fetching fitness consultant appointments",
      error: error.message,
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }
    const user = await userModel.findById(appointment.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.notification.push({
      type: "status-updated",
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: "/fitness-consultant-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error("Error in updating appointment status:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating appointment status",
      error: error.message,
    });
  }
};

module.exports = {
  getFitnessConsultantInfoController,
  updateProfileController,
  getFitnessConsultantByIdController,
  fitnessConsultantAppointmentsController,
  updateStatusController,
};
