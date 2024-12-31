const Workout = require("../models/workoutModel");
const User = require("../models/userModel");
// to check for valid id
const mongoose = require("mongoose");

// get all workouts with authentication

const getWorkouts = async (req, res) => {
  const user_id = req.user._id;
  // console.log("user id", user_id);

  const user = await User.find({ _id: user_id });
  // console.log("user", user);

  console.log("user", user);
  console.log("user type", typeof user);
  console.log("user.email", user[0].email);
  const added_to_email = user[0].email;

  // const {title, load, reps} = req.body
  // add doc to db
  try {
    // find workouts that userid == userid
    const workouts = await Workout.find({ added_to_email }).sort({
      createdAt: -1,
    });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWorkoutsTrainer = async (req, res) => {
  // var added_to_email = req.params;
  var added_to_email = req.params.email.toString();

  // console.log("in backend get workout added_to_email", added_to_email);
  // const {title, load, reps} = req.body
  // add doc to db
  try {
    // find workouts that userid == userid

    const workouts = await Workout.find({
      added_to_email: added_to_email.toString(),
    }).sort({
      createdAt: -1,
    });
    console.log("in backend get workout workouts", workouts);
    res.status(200).json(workouts);
  } catch (error) {
    console.log("\n\n\n", error);
    res.status(400).json({ error: error.message });
  }
};

// get all workouts without authentication

// const getWorkouts = async (req, res) => {

//     try{
//         // sorting with created date
//         // -1 is desending order
//         const workouts = await Workout.find({}).sort({createdAt: -1})
//         //  workouts is array of documents in the database
//         res.status(200).json(workouts)
//     } catch(error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// get a single workout advance

// const getSingleWorkout = async (req, res) => {

//     //const {title, load, reps} = req.body
//     // add doc to db
//     try{
//         const {id} = req.params

//         if(!mongoose.Types.ObjectId.isValid(id)){
//             return res.status(404).json({error: 'Id is not valid'})
//         }

//         const workout = await Workout.findById(id)
//         if(!workout) {
//             return res.status(404).json({error: 'No such workout'})
//         }
//         res.status(200).json(workout)
//     } catch(error) {
//         res.status(400).json({ error: error.message });
//     }

// }

// get a single workout basic

const getSingleWorkout = async (req, res) => {
  try {
    // grab workout id
    // all routes parameters are stored in params property

    const { id } = req.params;

    // checking for valid id
    // mongo db type valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Id is not valid" });
    }

    const workout = await Workout.findById(id);
    // if we dont get workout back (workout doesent exist)
    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }
    // if we found the workout thire is value for the workout
    console.log(workout);
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create new workout without validation

// const createWorkout =  async(req, res) => {
//     const {title, load, reps} = req.body

//     // add doc to db
//     try{
//         // create new workout
//         // create() function returns the object
//         const workout = await Workout.create({title, load, reps})
//         // send responce sending aded workout
//         res.status(200).json(workout)
//     } catch(error) {
//         res.status(400).json({ error: error.message });
//     }
// }

// create new workout with validation

const createWorkout = async (req, res) => {
  const { title, load, reps, added_by_role, added_by_email, added_to_email } =
    req.body;
  console.log(
    "in backend add workout",
    title,
    load,
    reps,
    added_by_role,
    added_by_email,
    added_to_email
  );
  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill all the fields", emptyFields });
  }

  // add doc to db

  try {
    console.log("hi");
    console.log(`\n\nrequest object is ${req}\n\n`);
    const user_id = req.user ? req.user._id : null;

    const workout = await Workout.create({
      title,
      load,
      reps,
      user_id,
      added_by_role,
      added_by_email,
      added_to_email,
    });
    res.status(200).json(workout);
  } catch (error) {
    console.log("\n\n", error, "\n\n");
    res.status(400).json({ error: error.message });
  }
};

// delete a workout

const deleteWorkout = async (req, res) => {
  try {
    // grab id from req object
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Id is not valid" });
    }

    var workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }
    // find on what parameter -> id
    // in mongoose id property is _id
    workout = await Workout.findOneAndDelete({ _id: id });

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a workout

const updateWorkout = async (req, res) => {
  const { title, load, reps } = req.body;
  //add doc to db
  console.log("update function in backend");
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Id is not valid" });
    }
    // first argument -> find ciceria
    // second argument -> object that represents the update thant want to make
    const workout = await Workout.findOneAndUpdate(
      { _id: id },
      { title, load, reps }
    );
    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete all workouts

const deleteWorkouts = async (req, res) => {
  try {
    // Delete all workouts
    await Workout.deleteMany({});

    // Optionally, you can return a response if needed
    res.status(200).json({ message: "All workouts deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exporting functions

module.exports = {
  // object
  createWorkout,
  getWorkouts,
  getSingleWorkout,
  deleteWorkout,
  updateWorkout,
  deleteWorkouts,
  getWorkoutsTrainer,
};
