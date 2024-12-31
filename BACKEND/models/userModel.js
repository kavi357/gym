const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const EmployeeModel = require("./empModel");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    default: "Chandrapala",
  },
  isUser: {
    type: Boolean,
    default: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notification: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
  },
});

// static signup method
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("password is not strong");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  var user = await this.findOne({ email });
  console.log("user", user);
  employee = null;

  if (!user) {
    console.log("bababa");
    employee = await EmployeeModel.findOne({ Email: email });
  }

  if (!user && !employee) {
    throw Error("Not registerd");
  }

  var match;

  if (user) {
    console.log("in match");
    match = await bcrypt.compare(password, user.password);
    console.log("match =", match);
  }

  console.log("hello hello");
  console.log("match =", match);
  console.log("employee =", employee);

  console.log("out match emp");
  if (employee) {
    console.log("in match emp");
    match = password == employee.password;
  }

  console.log("match down =", match);

  if (!match) {
    throw Error("Incorrect password");
  }

  // return user;
  if (user) {
    return user;
  } else if (employee) {
    user = employee;
    return user;
  }
};

module.exports = mongoose.model("User", userSchema);
