const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const mongoose = require("mongoose");
const cors = require("cors");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohorts = require("./cohorts.json");
const students = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

//Mongoose

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MODELS
const Cohort = require("./models/Cohort.model.js");
console.log("Cohort", Cohort);
const Student = require("./models/Student.model.js");

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...

app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Cohort Routes

app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    console.log("cohorts", cohorts);
    res.json(cohorts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/cohorts", async (req, res) => {
  try {
    const newCohort = req.body;
    const cohort = await Cohort.create(newCohort);
    res.status(201).json(cohort);
  } catch (error) {
    res.status(500).json({ message: "Error creating cohort" });
  }
});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  try {
    const cohort = await Cohort.findById(cohortId);
    res.json(cohort);
  } catch (error) {
    res.status(500).json({
      message: ` Error fetching cohort with id ${cohortId}`,
    });
  }
});

app.put("/api/cohorts/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  const updatedCohort = req.body;
  try {
    const cohort = await Cohort.findByIdAndUpdate(cohortId, updatedCohort, {
      new: true,
    }).populate("students");
    res.status(200).json(cohort);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: ` Error updating cohort with id ${cohortId}`,
    });
  }
});

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  try {
    await Cohort.findByIdAndDelete(cohortId);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      message: ` Error deleting cohort with id ${cohortId}`,
    });
  }
});
// Student Routes

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().populate("cohort");
    res.json(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const newStudent = req.body;
    const student = await Student.create(newStudent);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error creating student" });
  }
});

app.get("/api/students/cohort/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  try {
    const students = await Student.find({ cohort: cohortId });
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: ` Error fetching students from the cohort ${cohortId}`,
    });
  }
});

app.get("/api/students/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const student = await Student.findById(studentId).populate("cohort");
    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: ` Error fetching student with id ${studentId}`,
    });
  }
});

app.put("/api/students/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  const updatedStudent = req.body;
  try {
    const student = await Student.findByIdAndUpdate(studentId, updatedStudent, {
      new: true,
    });
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: ` Error updating student with id ${studentId}`,
    });
  }
});

app.delete("/api/students/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    await Student.findByIdAndDelete(studentId);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      message: ` Error deleting student with id ${studentId}`,
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
