// config() attach envoronment variables to the process globle object
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// odm library
// odm -> object data modelling

const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
// const userRoutes2 = require("./routes/userRoutes.js");
const blogRoutes = require("./routes/blog");
const quizRoutes = require("./routes/quiz");
const employeeRouter = require("./routes/employees");
const LeaveRouter = require("./routes/leave");
const attendance = require("./routes/attendence.js");
const employeeSalaryRouter = require("./routes/empSal.js");
const salaryPayRouter = require("./routes/payment.js");
const emailRoutes = require("./routes/emailRoutes.js");
const supplementsRoute = require("./routes/supplementsRoute");
const suppOrderRoute = require("./routes/supOrdersRoute.js");
const ClasssesRoutes = require("./routes/ClassesRoutes.js");
const PackageRoutes = require("./routes/PackagesRoutes.js");
const PurchasingRoutes = require("./routes/PurchasingRoutes");

const contactRouter = require("./routes/contacts.js");
const OtherRouter = require("./routes/others.js");
const TrainerRouter = require("./routes/trainers.js");
const RatingRouter = require("./routes/ratings.js");
const ContactUsRouter = require("./routes/contactUs.js");

// const userRoutesA = require("./routes/userRoutes");
const adminRoutesA = require("./routes/adminRoutes");
const fitnessConsultantRoutesA = require("./routes/fitnessConsultantRoutes");

// create express app

const app = express();

// middleware to use request object parameters in the code (id using req.id)
// check for request body and if request has a body it attach into req object

app.use(express.json());
app.use(cors({ credentials: true }));

// middleware - code between req and res
// this willl fire for every request
// next function is use to move to the next middleware

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes

// to create get request handler -> app.get
// to create a post request handler -> app.post
// to create a delete request handler -> app.delete
// but we dont have access to app inside workouts.js file in the route folder
// to do that we need to use express router in workouts.js file

// app.get('/', (req, res) => {
//     res.json({mssg: 'Welcome to the app!'})
// })

// when we request /api/workouts then use workoutRoutes

app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/employee", employeeRouter);
app.use("/leave", LeaveRouter);
app.use("/attendence", attendance);
app.use("/empSalary", employeeSalaryRouter);
app.use("/payment", salaryPayRouter);
app.use("/email", emailRoutes);
app.use("/api/supplements/", supplementsRoute);
app.use("/api/orders/", suppOrderRoute);
app.use("/api/Classes", ClasssesRoutes);
app.use("/api/packages", PackageRoutes);
app.use("/api/purchasing", PurchasingRoutes);

app.use("/contact", contactRouter);
app.use("/Other", OtherRouter);
app.use("/Trainer", TrainerRouter);
app.use("/rating", RatingRouter);
app.use("/contactUs", ContactUsRouter);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutesA);
app.use("/api/v1/fitness-consultant", fitnessConsultantRoutesA);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`\n\n\nconnected to database\n\n\n`);
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`\n\n\nlistening on port ${process.env.PORT}\n\n\n`);
    });
  })
  .catch((error) => {
    console.log("\n\n\nNot connected to database \n\n\n");
  });

/////////////

const port2 = 8000;

// MongoDB configuration
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://equipmentM:ChaamiV2001@cluster0.hnyjidx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create collections
    const equipments = client.db("EquipmentInventory").collection("equipments");
    const deletedEquipments = client
      .db("EquipmentInventory")
      .collection("deletedEquipments");
    const maintance = client.db("EquipmentInventory").collection("maintance");

    // Insert equipment to db
    app.post("/upload_equipment", async (req, res) => {
      console.log("in add equipment backend");
      const data = req.body;
      console.log("req body", req.body);
      const result = await equipments.insertOne(data);
      res.send(result);
    });

    // Update equipment data
    app.patch("/equip/:id", async (req, res) => {
      const id = req.params.id;
      const updateEquipmentData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...updateEquipmentData,
        },
      };

      const result = await equipments.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Delete equipment from db
    app.delete("/equip/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        // Get the equipment to be deleted
        const equipmentToDelete = await equipments.findOne(filter);

        // Add deletedDate field with current date
        const date = new Date();
        equipmentToDelete.deletedDate = date.toISOString().split("T")[0];

        // Store the equipment in the deletedEquipments collection
        await deletedEquipments.insertOne(equipmentToDelete);

        // Delete the equipment from the equipments collection
        const result = await equipments.deleteOne(filter);

        res
          .status(200)
          .json({ message: "Equipment deleted successfully", result });
      } catch (error) {
        console.log("Error deleting equipment:", error);
        res.status(500).json({ message: "Error deleting equipment", error });
      }
    });

    // Find equipment by category
    app.get("/all-equipments", async (req, res) => {
      let query = {};
      console.log("in all equipment backend");
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      const result = await equipments.find(query).toArray();
      res.send(result);
    });

    // Find deleted equipments
    app.get("/deleted-equipments", async (req, res) => {
      const result = await deletedEquipments.find().toArray();
      res.send(result);
    });

    // Get single equipment data
    app.get("/equip/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await equipments.findOne(filter);
      res.send(result);
    });

    // Fetch maintenance data by ID
    app.get("/maintenance/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const maintenanceData = await maintance.findOne({
          _id: new ObjectId(id),
        });
        res.json(maintenanceData);
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
        res
          .status(500)
          .json({ message: "Error fetching maintenance data", error });
      }
    });

    // Update maintenance data
    app.patch("/maintenance/:id", async (req, res) => {
      const id = req.params.id;
      const updateMaintenanceData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...updateMaintenanceData,
        },
      };

      const result = await maintance.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Store maintenance data
    app.post("/maintenance", async (req, res) => {
      const { equipmentName, purchaseDate, lastMaintain, mTime } = req.body;

      try {
        const maintenanceData = {
          equipmentName,
          purchaseDate,
          lastMaintain,
          mTime,
        };

        const result = await maintance.insertOne(maintenanceData);

        res
          .status(200)
          .json({ message: "Maintenance data stored successfully", result });
      } catch (error) {
        console.log("Error storing maintenance data:", error);
        res
          .status(500)
          .json({ message: "Error storing maintenance data", error });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port2, () => {
  console.log(`\n\nlistening on port ${port2}\n\n`);
});
