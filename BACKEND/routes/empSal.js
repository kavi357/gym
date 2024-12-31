const router = require("express").Router();
const moment = require("moment"); // Import moment for date parsing
let EmployeeSal = require("../models/empSalary");
let Employee = require("../models/empModel");
let EmployeeSalaryPay = require("../models/SalaryPayment");
const { startOfMonth, isAfter, format } = require("date-fns");

router.route("/addSalary").post(async (req, res) => {
  const NIC = req.body.NIC;
  const Month = moment(req.body.Month); // Use moment for date parsing
  const BasicSalary = Number(req.body.BasicSalary);
  const OTRate = Number(req.body.OTRate);
  const OTHours = Number(req.body.OTHours);
  const Bonus = Number(req.body.Bonus);
  const TotalSalary = Number(req.body.TotalSalary);

  // Add validation checks
  if (
    isNaN(BasicSalary) ||
    isNaN(Bonus) ||
    isNaN(TotalSalary) ||
    isNaN(OTRate) ||
    isNaN(OTHours)
  ) {
    return res
      .status(400)
      .json("BasicSalary, Bonus, and TotalSalary must be valid numbers");
  }

  try {
    // Check if the employee with the specified NIC exists
    const employee = await Employee.findOne({ NIC });

    if (!employee) {
      return res.status(404).json({ status: "Employee not found" });
    }

    // Update the salaryDetails field in the Employee document
    employee.salaryDetails = {
      Month,
      BasicSalary,
      OTRate,
      OTHours,
      Bonus,
      TotalSalary,
    };

    // Save the updated Employee document
    await employee.save();

    // Insert the salary record in the EmployeeSal collection
    await EmployeeSal.create({
      NIC,
      Month,
      BasicSalary,
      OTRate,
      OTHours,
      Bonus,
      TotalSalary,
    });

    // Send success message to the frontend in JSON format
    res.json("Employee Salary details are successfully saved!");
  } catch (err) {
    console.error("Error saving employee salary details:", err);
    res.status(502).json("Internal Server Error");
  }
});

//search employee Id
router.route("/get/:nic").get(async (req, res) => {
  let nic = req.params.nic;

  try {
    const employee = await Employee.findOne({ NIC: nic });

    if (employee) {
      res.status(200).send({
        status: "Employee fetched",
        firstName: employee.FirstName,
        lastName: employee.LastName,
        Role: employee.Role,
      });
    } else {
      res.status(404).send({ status: "Employee not found" });
    }
  } catch (err) {
    console.error("Error with get employee:", err.message);
    res
      .status(500)
      .send({ status: "Internal Server Error", error: err.message });
  }
});

//search salary
router.route("/get/:nic").get(async (req, res) => {
  let nic = req.params.nic;

  try {
    const employeeSal = await EmployeeSal.findOne({ NIC: nic });

    console.log("Query NIC:", employeeSal);
    console.log("Query Result:", nic);

    if (employeeSal) {
      res.status(200).send({
        status: "Employee fetched",
        Month: employeeSal.Month,
        BasicSalary: employeeSal.BasicSalary,
        Bonus: employeeSal.Bonus,
        TotalSalary: employeeSal.TotalSalary,
      });
    } else {
      res.status(404).send({ status: "Employee not found" });
    }
  } catch (err) {
    console.error("Error with get employee:", err.message);
    res
      .status(500)
      .send({ status: "Internal Server Error", error: err.message });
  }
});

//search TotSal by NIC

router.route("/getSal/:nic").get(async (req, res) => {
  let nic = req.params.nic;

  try {
    const employeesal = await EmployeeSal.findOne({ NIC: nic });

    console.log("Query Result:", nic);

    if (employeesal) {
      res.status(200).send({
        status: "Employee fetched",
        TotalSalary: employeesal.TotalSalary,
        Bonus: employeesal.Bonus,
        BasicSalary: employeesal.BasicSalary,
      });
    } else {
      res.status(404).send({ status: "Employee not found" });
    }
  } catch (err) {
    console.error("Error with get employee:", err.message);
    res
      .status(500)
      .send({ status: "Internal Server Error", error: err.message });
  }
});

//display details of all the employees
router.route("/viewSalary").get(async (req, res) => {
  try {
    const employeesWithSalary = await Employee.find(
      {},
      {
        _id: 1,
        NIC: 1,
        Role: 1,
        Email: 1,
        "salaryDetails.BasicSalary": 1,
        "salaryDetails.Bonus": 1,
        "salaryDetails.OTRate": 1,
        "salaryDetails.OTHours": 1,
        "salaryDetails.TotalSalary": 1,
        "salaryDetails.Month": 1,
      }
    );

    res.json(employeesWithSalary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//display all the columns in employeesalary table
router.route("/displayEmployeeSalary").get(async (req, res) => {
  try {
    console.log("In backend display employee salary");
    // Query all documents from the EmployeeSal collection
    const employeeSalaries = await EmployeeSalaryPay.find({});
    console.log("In backend router :", employeeSalaries);
    // Send the retrieved documents to the frontend
    res.json(employeeSalaries);
  } catch (err) {
    console.error("Error retrieving employee salaries:", err);
    res.status(500).json("Internal Server Error");
  }
});

//update salary
router.put("/updateSalary/:id", async (req, res) => {
  const employeeId = req.params.id;

  try {
    // Assuming you have the salary data in the request body
    const { BasicSalary, Bonus, TotalSalary } = req.body;

    // Update the employee's salary in the EmployeeSal collection
    const updatedEmployeeSal = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: { BasicSalary, Bonus, TotalSalary } },
      { new: true }
    );

    // Check if the salary was updated successfully
    if (!updatedEmployeeSal) {
      return res
        .status(404)
        .json({ error: "Employee not found or could not update salary" });
    }

    // Access the properties only if updatedEmployeeSal is defined
    const response = {};
    if (updatedEmployeeSal.BasicSalary !== undefined) {
      response.BasicSalary = updatedEmployeeSal.BasicSalary;
    }
    if (updatedEmployeeSal.Bonus !== undefined) {
      response.Bonus = updatedEmployeeSal.Bonus;
    }
    if (updatedEmployeeSal.TotalSalary !== undefined) {
      response.TotalSalary = updatedEmployeeSal.TotalSalary;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating salary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a function to transform salary details
const transformSalaryDetails = (salaryDetails) => {
  if (salaryDetails && Object.keys(salaryDetails).length > 0) {
    return Object.keys(salaryDetails).map((key) => {
      return {
        Month: salaryDetails[key].Month,
        BasicSalary: salaryDetails[key].BasicSalary,
        Bonus: salaryDetails[key].Bonus,
        TotalSalary: salaryDetails[key].TotalSalary,
      };
    });
  } else {
    return [];
  }
};

//const { startOfMonth, isAfter, format } = require("date-fns");

router.get("/getTotalSalariesByMonth", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || ""; // Extract searchTerm from query parameters

    // Fetch all employees with their salary details
    const employees = await Employee.find({}, "salaryDetails");

    // Find the earliest salary month present in the table
    const earliestSalary = employees.reduce((earliest, current) => {
      const currentSalaryMonth = new Date(current.salaryDetails.Month);
      return currentSalaryMonth < earliest ? currentSalaryMonth : earliest;
    }, new Date());

    // Determine the range of months to fetch salaries for, starting from the earliest month up to the current month of the current year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const startDate = new Date(
      earliestSalary.getFullYear(),
      earliestSalary.getMonth(),
      1
    );
    const endDate = new Date(currentYear, currentMonth, 1);

    // Initialize an object to store the sum of total salaries for each month
    const totalSalariesByMonth = {};

    // Iterate over the range of dates
    let previousMonthTotal = 0; // Variable to store the total salary of the previous month
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const month = format(date, "yyyy-MM");
      totalSalariesByMonth[month] = previousMonthTotal;

      // Iterate through each employee and add the current month's salary to the total
      employees.forEach((employee) => {
        const salaryDetails = employee.salaryDetails;
        if (salaryDetails && salaryDetails.Month && salaryDetails.TotalSalary) {
          const salaryMonth = new Date(salaryDetails.Month);
          const salaryMonthFormatted = format(salaryMonth, "yyyy-MM");

          // Check if the salary month matches the current month
          if (salaryMonthFormatted === month) {
            // Check if the employee has NIC or ID and it matches the searchTerm
            const nicMatch =
              employee.NIC &&
              employee.NIC.toLowerCase().includes(searchTerm.toLowerCase());
            const idMatch =
              employee._id &&
              employee._id
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            // Check if the salary month is within the desired range
            const dateFilterMatch =
              salaryMonth >= startDate && salaryMonth <= endDate;

            if ((nicMatch || idMatch) && dateFilterMatch) {
              // Add the current month's salary to the total for this month
              totalSalariesByMonth[month] += salaryDetails.TotalSalary || 0;
            }
          }
        }
      });

      // Update the previousMonthTotal for the next iteration
      previousMonthTotal = totalSalariesByMonth[month];
    }

    res.json(totalSalariesByMonth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); // Include the error message in the response
  }
});

router.get("/getSalaryIncrements", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || ""; // Extract searchTerm from query parameters

    // Fetch all employees with their salary details
    const employees = await Employee.find({}, "salaryDetails");

    // Find the earliest salary month present in the table
    const earliestSalary = employees.reduce((earliest, current) => {
      const currentSalaryMonth = new Date(current.salaryDetails.Month);
      return currentSalaryMonth < earliest ? currentSalaryMonth : earliest;
    }, new Date());

    // Determine the range of months to fetch salaries for, starting from the earliest month up to the current month of the current year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const startDate = new Date(
      earliestSalary.getFullYear(),
      earliestSalary.getMonth(),
      1
    );
    const endDate = new Date(currentYear, currentMonth, 1);

    // Initialize an object to store the salary increments for each month
    const salaryIncrements = {};

    // Initialize the previous total salary to null
    let previousTotalSalary = null;

    // Iterate over each month within the range
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const month = date.toISOString().slice(0, 7); // Format the date as YYYY-MM

      // Calculate the total salary for the current month
      let totalSalaryOfMonth = 0;
      employees.forEach((employee) => {
        const salaryDetails = employee.salaryDetails;
        if (salaryDetails && salaryDetails.Month && salaryDetails.TotalSalary) {
          const salaryMonth = new Date(salaryDetails.Month);
          const salaryMonthFormatted = salaryMonth.toISOString().slice(0, 7); // Format the salary month as YYYY-MM

          if (salaryMonthFormatted === month) {
            // Check if the employee has NIC or ID and it matches the searchTerm
            const nicMatch =
              employee.NIC &&
              employee.NIC.toLowerCase().includes(searchTerm.toLowerCase());
            const idMatch =
              employee._id &&
              employee._id
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            if (nicMatch || idMatch) {
              // Add the salary for this employee to the total salary of the month
              totalSalaryOfMonth += salaryDetails.TotalSalary;
            }
          }
        }
      });

      // Calculate the salary increment for this month
      if (previousTotalSalary !== null) {
        // Ensure no negative increment occurs when the total salary for the month is equal to the previous month
        salaryIncrements[month] = Math.max(
          0,
          totalSalaryOfMonth - previousTotalSalary
        );
      } else {
        // For the first month, set the salary increment as the total salary of that month
        salaryIncrements[month] = totalSalaryOfMonth;
      }

      // Update the previous total salary for the next iteration
      previousTotalSalary = totalSalaryOfMonth;
    }

    res.json(salaryIncrements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); // Include the error message in the response
  }
});

module.exports = router;
