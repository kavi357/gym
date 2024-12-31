const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const fitnessConsultantModel = require("../models/fitnessConsultantModel");
const empModel = require("../models/empModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// ligin user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const isUser = user.isUser;
    const role = user.Role;
    const NIC = user.NIC;

    console.log("user in user controller", user);
    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, isUser, role, NIC });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  // res.json({mssg: 'login user'})
};

// signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
    // res.status(200).json({email, user})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  // res.json({mssg: 'signup user'})
};

const applyFitnessConsultant = async (req, res) => {
  console.log("in applyFitnessConsultant backend");
  console.log(req.body);

  try {
    const newFitnessConsultant = await fitnessConsultantModel({
      ...req.body,
      status: "pending",
    });
    await newFitnessConsultant.save();
    const adiminUser = await empModel.findOne({
      Role: "fitness consultant manager",
    });
    console.log("consultant ", adiminUser);
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
    await empModel.findByIdAndUpdate(adiminUser._id, { notification });
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

module.exports = { signupUser, loginUser, applyFitnessConsultant };
