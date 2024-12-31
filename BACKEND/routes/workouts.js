// this file is to register defferent routes

const express = require("express");

// to create new woork out we need workout model
// const workout = require('../models/workoutModel')

// importing functions

const {
  createWorkout,
  getWorkouts,
  getSingleWorkout,
  deleteWorkout,
  updateWorkout,
  deleteWorkouts,
  getWorkoutsTrainer,
} = require("../controllers/workoutController");
const requireAuth = require("../middleware/requireAuth");

// create instance of the router
// (to use app in this file)
const router = express.Router();

// require auth for all workout routes
router.use(requireAuth);

// attach handler to router
// GET all workouts

// router.get('/', (req, res) => {
//     res.json({mssg: 'Get all workouts'})
// })

router.get("/", getWorkouts);
router.get("/trainer/:email", getWorkoutsTrainer);

// GET single workouts

// router.get('/:id', (req, res) => {
//     res.json({mssg: 'GET single workout'})
// })

router.get("/:id", getSingleWorkout);

// POST single workouts
// creating new workout

// adding new workout using workout model to the workout collection

// router.post('/',  async(req, res) => {
//     const {title, load, reps} = req.body

//     // add doc to db
//     try{
//         // create new workout
//         // create() function returns the object
//         const Workout = await workout.create({title, load, reps})
//         // send responce sending aded workout
//         res.status(200).json(Workout)
//     } catch(error) {
//         res.status(400).json({ error: error.message });
//     }
// })

router.post("/", createWorkout);

// DELETE a workout
// router.delete('/:id', (req, res) => {
//     res.json({mssg: 'DELETE a workout'})
// })
router.delete("/:id", deleteWorkout);

// UPDATE a workout
// router.patch('/:id', (req, res) => {
//     res.json({mssg: 'UPDATE a workout'})
// })
router.patch("/:id", updateWorkout);

// DELETE all workouts
// router.patch('/:id', (req, res) => {
//     res.json({mssg: 'UPDATE a workout'})
// })
router.delete("/", deleteWorkouts);

// export the express router for use in server.js file
module.exports = router;
