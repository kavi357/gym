const express = require("express");
const router = express.Router();
const Leave = require("../models/leaveModel");
const Employee = require("../models/empModel"); // Assuming your Employee model is named "employee"

// View all leaves with employee info
router.route("/viewLeave").get(async (req, res) => {
  try {
    const leaves = await Leave.find({})
      .select("leaveId LeaveType LeaveFrom LeaveTo NIC")
      .lean();

    const leavesWithEmployeeInfo = await Promise.all(
      leaves.map(async (leave) => {
        const employee = await Employee.findOne({ NIC: leave.NIC })
          .select("FirstName LastName NIC Role")
          .lean();

        return {
          leaveId: leave.leaveId,
          LeaveType: leave.LeaveType,
          LeaveFrom: leave.LeaveFrom,
          LeaveTo: leave.LeaveTo,
          NIC: leave.NIC,
          EmployeeDetails: employee,
        };
      })
    );

    // Group leaves by NIC
    const leavesGroupedByNIC = leavesWithEmployeeInfo.reduce(
      (result, leave) => {
        const nic = leave.NIC;

        if (!result[nic]) {
          result[nic] = [];
        }

        result[nic].push(leave);

        return result;
      },
      {}
    );

    console.log("Leaves Grouped by NIC:", leavesGroupedByNIC);
    res.json(leavesGroupedByNIC);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Insert (POST) route to add leave details
router.route("/addLeave").post(async (req, res) => {
  const { NIC, LeaveType, LeaveFrom, LeaveTo, leaveId } = req.body;

  try {
    // Check if the NIC exists in the employee collection
    const employee = await Employee.findOne({ NIC });

    if (!employee) {
      return res
        .status(400)
        .json({ error: "Employee not found with the provided NIC" });
    }

    // Check if the leaveId is already in use
    const existingLeave = await Leave.findOne({ leaveId });

    if (existingLeave) {
      return res
        .status(400)
        .json({ error: "Duplicate key error: leaveId must be unique" });
    }

    // Check if the employee has already taken 3 leaves in the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const leavesInCurrentMonth = await Leave.find({
      NIC,
      LeaveFrom: { $gte: new Date(`${currentYear}-${currentMonth + 1}-01`) },
      LeaveTo: { $lte: new Date(`${currentYear}-${currentMonth + 1}-31`) },
    });

    if (leavesInCurrentMonth.length >= 3) {
      return res.status(400).json({
        error: "Employee has reached the maximum leave limit for this month",
      });
    }

    // Check if the leave period is exactly 3 days
    // Check if the leave period is exactly 3 days
    const leavePeriodInDays = Math.ceil(
      (new Date(LeaveTo) - new Date(LeaveFrom)) / (1000 * 60 * 60 * 24)
    );

    if (leavePeriodInDays > 3) {
      return res
        .status(400)
        .json({ error: "maximim Leave period should be  3 days" });
    }

    // Create a new Leave document with the provided leaveId
    const newLeave = new Leave({
      leaveId,
      NIC,
      LeaveType,
      LeaveFrom,
      LeaveTo,
    });

    // Save the new Leave document
    const savedLeave = await newLeave.save();

    res.json(savedLeave); // Send the saved Leave document as a response
  } catch (err) {
    console.error("Error saving leave details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update leave details
router.route("/updateLeave/:id").put(async (req, res) => {
  const leaveId = req.params.id;
  const { LeaveType, LeaveFrom, LeaveTo } = req.body;

  try {
    const leave = await Leave.findOneAndUpdate(
      { leaveId },
      { $set: { LeaveType, LeaveFrom, LeaveTo } },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ status: "Leave not found" });
    }

    res.json(leave);
  } catch (err) {
    console.error("Error updating leave details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete leave by leaveId
router.route("/deleteLeave/:leaveId").delete(async (req, res) => {
  const leaveId = req.params.leaveId;

  try {
    const result = await Leave.findOneAndDelete({ leaveId });

    if (!result) {
      return res.status(404).json({ status: "Leave not found" });
    }

    res.json({ status: "Leave deleted successfully" });
  } catch (err) {
    console.error("Error deleting leave:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search leaves by NIC
router.route("/searchByNIC/:nic").get(async (req, res) => {
  const nic = req.params.nic;

  try {
    const leaves = await Leave.find({ NIC: nic })
      .select("LeaveType LeaveFrom LeaveTo NIC")
      .lean();

    const employeeDetails = await Employee.findOne({ NIC: nic })
      .select("FirstName LastName NIC Role")
      .lean();

    const leavesWithEmployeeInfo = leaves.map((leave) => ({
      leaveId: leave.leaveId,
      LeaveType: leave.LeaveType,
      LeaveFrom: leave.LeaveFrom,
      LeaveTo: leave.LeaveTo,
      NIC: leave.NIC,
      EmployeeDetails: employeeDetails,
    }));

    console.log("Leaves with Employee Info:", leavesWithEmployeeInfo);
    res.json(leavesWithEmployeeInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//find latest leave id
router.route("/getLatestLeaveId").get(async (req, res) => {
  try {
    // Find the latest leave ID from the leaves collection
    const latestLeave = await Leave.findOne(
      {},
      { leaveId: 1 },
      { sort: { createdAt: -1 } }
    );

    if (latestLeave) {
      res.json(latestLeave.leaveId);
    } else {
      // If no leave ID is found, start with the initial leave ID
      res.json("L001");
    }
  } catch (error) {
    console.error("Error fetching latest leave ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/todaysLeave").get(async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const todaysLeaves = await Leave.find({
      $or: [
        { LeaveFrom: { $lte: today }, LeaveTo: { $gte: today } },
        { LeaveFrom: today, LeaveTo: today },
      ],
    }).exec();

    const onLeaveEmployees = await Promise.all(
      todaysLeaves.map(async (leave) => {
        const employee = await Employee.findOne({ NIC: leave.NIC }).exec();

        // Check if the employee exists in the Employee table
        if (employee) {
          return {
            NIC: leave.NIC,
            leaveFrom: leave.LeaveFrom.toISOString(),
            leaveTo: leave.LeaveTo.toISOString(),
            employeeDetails: {
              firstName: employee.firstName,
              lastName: employee.lastName,
              // Add more employee details as needed
            },
          };
        }

        // If employee does not exist, return null
        return null;
      })
    );

    // Filter out null values (employees not found in the Employee table)
    const filteredOnLeaveEmployees = onLeaveEmployees.filter(
      (employee) => employee !== null
    );

    res.json({
      today: today.toISOString(),
      todaysLeaveCount: filteredOnLeaveEmployees.length,
      onLeaveEmployees: filteredOnLeaveEmployees,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

module.exports = router;
