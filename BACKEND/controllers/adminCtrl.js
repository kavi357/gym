const fitnessConsultantModel = require("../models/fitnessConsultantModel");
const userModel = require("../models/userModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users Data",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while fetching users",
      success: false,
      error,
    });
  }
};

const getAllFitnessConsultantController = async (req, res) => {
  try {
    const fitnessConsultants = await fitnessConsultantModel.find({});
    res.status(200).send({
      success: true,
      message: "Fitness Consultants Data",
      data: fitnessConsultants,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting fitness consultants data",
      error,
    });
  }
};

//FitnessConsultants Account Status
const changeAccountStatusController = async (req, res) => {
  try {
    const { fitnessConsultantId, status } = req.body;
    const fitnessConsultant = await fitnessConsultantModel.findByIdAndUpdate(
      fitnessConsultantId,
      { status }
    );
    const user = await userModel.findOne({ _id: fitnessConsultant.userId });
    const notification = user.notification;
    notification.push({
      type: "fitness-consultant-request-updated",
      message: `Your Fitness Consultant Account Request Has ${status}`,
      onClickPath: "/notification",
    });

    user.isFitnessConsultant = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: fitnessConsultant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in account status",
      error,
    });
  }
};

const deleteFitnessConsultantController = async (req, res) => {
  try {
    const { fitnessConsultantId } = req.body;
    await fitnessConsultantModel.findByIdAndDelete(fitnessConsultantId);

    res.status(200).send({
      success: true,
      message: "Fitness Consultant Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting fitness consultant",
      error,
    });
  }
};

module.exports = {
  getAllFitnessConsultantController,
  getAllUsersController,
  changeAccountStatusController,
  deleteFitnessConsultantController,
};
