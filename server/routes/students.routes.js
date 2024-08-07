const router = require("express").Router();
const mongoose = require("mongoose");

const Student = require("../models/Student.model");

// Student Routes

router.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().populate("cohort");
    res.json(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/api/students", async (req, res) => {
  try {
    const newStudent = req.body;
    const student = await Student.create(newStudent);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error creating student" });
  }
});

router.get("/api/students/cohort/:cohortId", async (req, res) => {
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

router.get("/api/students/:studentId", async (req, res) => {
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

router.put("/api/students/:studentId", async (req, res) => {
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

router.delete("/api/students/:studentId", async (req, res) => {
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

module.exports = router;
