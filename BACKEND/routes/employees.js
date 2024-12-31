const router = require("express").Router();
let Employee = require("../models/empModel");
let User = require("../models/userModel");
const express = require("express");

//insert data
router.route("/add").post(async (req, res) => {
  const FirstName = req.body.FirstName;
  const LastName = req.body.LastName;
  const NIC = req.body.NIC;
  const Role = req.body.Role;
  const Gender = req.body.Gender;
  const DOB = new Date(req.body.DOB);
  const ContactNo = Number(req.body.ContactNo);
  const Email = req.body.Email;
  const Address = req.body.Address;
  const JoinedDate = new Date(req.body.JoinedDate);

  const findExist = async (Email) => {
    const test = await Employee.findOne({
      Email: Email,
    });

    if (test) {
      res.status(325).send({
        status: "Employee already available",
        error: "Employee already available",
      });
      console.log("\n\n\n\nemployee exists\n\n\n");
      return true;
    }
    return false;
  };

  if (await findExist(Email)) {
    return;
  }

  const findExistNIC = async (NIC) => {
    const test = await Employee.findOne({
      NIC: NIC,
    });

    if (test) {
      res.status(324).send({
        status: "NIC already available",
        error: "NIC already available",
      });

      return true;
    }
    return false;
  };

  if (await findExistNIC(NIC)) {
    return;
  }

  const newEmployee = new Employee({
    FirstName,
    LastName,
    NIC,
    Role,
    Gender,
    DOB,
    ContactNo,
    Email,
    Address,
    JoinedDate,
  });

  newEmployee
    .save()
    .then(() => {
      // Send message to the frontend in JSON format
      res.json("Employee Details are successfully saved!");
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        // Mongoose validation error, send 400 Bad Request with error messages
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message
        );
        res
          .status(400)
          .json({ error: "Validation failed", details: validationErrors });
      } else if (err.code === 11000) {
        // Unique constraint violation error, send 400 Bad Request with a custom message
        res.status(400).json({
          error: "Duplicate key",
          message: "NIC or email already exists.",
        });
      } else {
        // Other types of errors, handle them as needed
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
});

//display details of all the employees
router.route("/displayAllEmp").get((req, res) => {
  Employee.find()
    .then((employees) => {
      res.json(employees);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/displayAllUsers").get((req, res) => {
  User.find()
    .then((employees) => {
      res.json(employees);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Update route
router.route("/Update/:id").put(async (req, res) => {
  try {
    let empId = req.params.id;
    const {
      FirstName,
      LastName,
      NIC,
      Gender,
      Role,
      DOB,
      ContactNo,
      Email,
      Address,
      JoinedDate,
    } = req.body;

    const updateEmp = {
      FirstName,
      LastName,
      NIC,
      Gender,
      Role,
      DOB,
      ContactNo,
      Email,
      Address,
      JoinedDate,
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(empId, updateEmp, {
      new: true,
    });

    if (updatedEmployee) {
      res
        .status(200)
        .send({ status: "Employee details updated", user: updatedEmployee });
    } else {
      res
        .status(404)
        .send({ status: "Employee not found or update unsuccessful" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error with updating", error: err.message });
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  const employeeId = req.params.id;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(
      employeeId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedEmployee) {
      console.error(`Employee with ID ${employeeId} not found`);
      return res.status(404).json({ error: "Employee not found" });
    }

    console.log(`Employee with ID ${employeeId} deleted successfully`);
    res.json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

router.route("/delete/user/:id").delete(async (req, res) => {
  const employeeId = req.params.id;

  try {
    const deletedEmployee = await User.findByIdAndDelete(
      employeeId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedEmployee) {
      console.error(`Employee with ID ${employeeId} not found`);
      return res.status(404).json({ error: "Employee not found" });
    }

    console.log(`Employee with ID ${employeeId} deleted successfully`);
    res.json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

router.route("/displayAllEmpIncludingDeleted").get(async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all records, including deleted ones
    res.json(employees);

    console.log("aaa", employees);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

//search
router.route("/get/:eid").get(async (req, res) => {
  let sid = req.params.eid;
  const e = await Employee.findById(sid)
    .then((employee) => {
      res.status(200).send({ status: "employee fetched", employee });
    })
    .catch(() => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get employee", error: err.message });
    });
});

// Route to check if the provided email belongs to an admin in the Employee table
router.route("/employee/checkAdminEmail/:email").get(async (req, res) => {
  try {
    const { email } = req.params;

    // Check if the email exists in the Employee table and has an "admin" role
    const adminEmployee = await Employee.findOne({
      Email: email,
      Role: "admin",
    });

    if (adminEmployee) {
      return res.status(200).json({
        exists: true,
        isAdmin: true,
        role: adminEmployee.Role,
        NIC: adminEmployee.NIC,
        // Add any other details you want to include
      });
    } else {
      return res.status(200).json({ exists: false, isAdmin: false });
    }
  } catch (error) {
    console.error("Error in /employee/checkAdminEmail route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//employee count
router.route("/employeeCount").get(async (req, res) => {
  try {
    // Get the employee count
    const employeeCount = await Employee.countDocuments();

    // Send the response
    res.send(`${employeeCount}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
