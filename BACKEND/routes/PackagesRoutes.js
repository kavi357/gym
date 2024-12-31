const express = require("express");

const router = express.Router();

const Package = require("../models/Package");

router.get("/getallpackages", async (req, res) => {
  try {
    const packages = await Package.find({});
    res.send(packages);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get("/getpackagebyid", async (req, res) => {
  const packageItemid = req.query.packageItemid;

  try {
    const packageItem = await Package.findById(packageItemid);
    res.json(packageItem);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/addpackageItem", async (req, res) => {
  try {
    const newPackageItem = new Package(req.body);
    await newPackageItem.save();
    return res.json("New Package Added Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// DELETE a packageItem by ID
router.delete("/deletePackage/:_id", async (req, res) => {
  try {
    const packageItem = await Package.findByIdAndDelete(req.params._id);
    if (!packageItem) {
      return res.status(404).json({ error: "PackageItem not found" });
    }

    return res.json("PackageItem deleted successfully");
  } catch (error) {
    console.error("Error deleting packageItem:", error); // Log deletion error
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//update the package

router.put("/updatepackage/:id", async (req, res) => {
  const packageId = req.params.id;

  try {
    const updatedFields = {};
    if (req.body.name) updatedFields.name = req.body.name;
    if (req.body.paymentperday)
      updatedFields.paymentperday = req.body.paymentperday;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.type) updatedFields.type = req.body.type;
    if (req.body.imageurls) updatedFields.imageurls = req.body.imageurls;

    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      updatedFields,
      { new: true }
    );
    res.json(updatedPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
