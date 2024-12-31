const express = require("express");
const router = express.Router();
const Supplement = require("../models/supplementsModel");

router.get("/getallsupplements", async (req, res) => {
  try {
    const supplements = await Supplement.find({});
    res.send(supplements);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/addSupplements", async (req, res) => {
  const supplement = req.body.supplement;
  try {
    const newsupplement = new Supplement({
      productname: supplement.productname,
      price: parseFloat(supplement.price),
      description: supplement.description,
      category: supplement.category,
      image: supplement.image,
    });
    await newsupplement.save();
    res.send("New Product Added Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getSupplementById", async (req, res) => {
  const supplementid = req.body.supplementid;
  try {
    const supplement = await Supplement.findOne({ _id: supplementid });
    res.send(supplement);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/editsupplement", async (req, res) => {
  const editedsupplement = req.body.editedsupplement;
  try {
    const supplement = await Supplement.findOne({ _id: editedsupplement._id });
    supplement.productname = editedsupplement.productname;
    supplement.category = editedsupplement.category;
    supplement.price = parseFloat(editedsupplement.price);
    supplement.description = editedsupplement.description;
    supplement.image = editedsupplement.image;
    await supplement.save();
    res.send("Supplement details edited successfully..");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/deletesupplement", async (req, res) => {
  const supplementid = req.body.supplementid;
  try {
    await Supplement.findOneAndDelete({ _id: supplementid });
    res.send("Supplement deleted successfully..");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
