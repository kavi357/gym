// mongoose allows us to create scemas and
// models in database
// mongodb alone is scemaless
// schema defines the structure
// model applys schema in to perticular model

const mongoose = require("mongoose");

// function to create new schema
const Schema = mongoose.Schema;

// Schema function has two parameters
const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      require: true,
    },
    load: {
      type: Number,
      required: true,
    },
    user_id: {
      type: String,
    },
    added_by_role: {
      type: String,
      required: true,
    },
    added_by_email: {
      type: String,
      required: true,
    },
    added_to_email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// mongoose.model creates new model
// model name Workout
// workout collection (automatically) -> workouts
// scema is workoutSchema
// we use Workout model to interact with Workout collection
// collection is creating automatically

module.exports = mongoose.model("Workout", workoutSchema);

// Workout.find will find all workouts
