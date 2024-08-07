const router = require("express").Router();
const mongoose = require("mongoose");

const Cohort = require("../models/Cohort.model");

// Cohort Routes

router.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    console.log("cohorts", cohorts);
    res.json(cohorts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/api/cohorts", async (req, res) => {
  try {
    const newCohort = req.body;
    const cohort = await Cohort.create(newCohort);
    res.status(201).json(cohort);
  } catch (error) {
    res.status(500).json({ message: "Error creating cohort" });
  }
});

router.get("/api/cohorts/:cohortId", async (req, res) => {
  const cohortId = req.params.cohortId;
  if (!mongoose.Types.ObjectId.isValid(cohortId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  try {
    const cohort = await Cohort.findById(cohortId);
    res.json(cohort);
    console.log("cohort", cohort);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching cohort with id ${cohortId}`,
    });
  }
});

router.put("/api/cohorts/:cohortId", async (req, res) => {
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

router.delete("/api/cohorts/:cohortId", async (req, res) => {
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

module.exports = router;
