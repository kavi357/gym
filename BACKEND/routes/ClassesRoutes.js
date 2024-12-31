const express = require("express");

const router = express.Router();

const Class = require("../models/Class");

router.get("/getallclasses", async (req, res) => {
  try {
    const classes = await Class.find({});
    res.send(classes);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get("/getclassbyid", async (req, res) => {
  const classItemid = req.query.classItemid;

  try {
    const classItem = await Class.findById(classItemid);
    res.send(classItem);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/addclassItem", async (req, res) => {
  try {
    const newClassItem = new Class(req.body);
    await newClassItem.save();
    return res.json("New Package Added Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// DELETE a classitem by ID
router.delete("/deleteClass/:_id", async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params._id);
    if (!classItem) {
      return res.status(404).json({ error: "ClassItem not found" });
    }

    return res.json("ClassItem deleted successfully");
  } catch (error) {
    console.error("Error deleting classItem:", error); // Log deletion error
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//update the class

// Update the class
// Update the class
router.put("/updateclass/:id", async (req, res) => {
  const classid = req.params.id;

  try {
    const updatedFields = {};
    if (req.body.name) updatedFields.name = req.body.name;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.type) updatedFields.type = req.body.type;
    if (req.body.imageurls) updatedFields.imageurls = req.body.imageurls;

    const updatedClass = await Class.findByIdAndUpdate(classid, updatedFields, {
      new: true,
    });
    res.json(updatedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
