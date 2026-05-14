const express = require("express");
const router = express.Router();

const Task = require("../models/Task");


// CREATE TASK
router.post("/", async (req, res) => {

  try {

    const newTask = new Task(req.body);

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

});


// GET ALL TASKS
router.get("/", async (req, res) => {

  try {

    // POPULATE TEAM DETAILS
    const tasks = await Task.find()
      .populate("teamId", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

});


// UPDATE TASK
router.put("/:id", async (req, res) => {

  try {

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updatedTask);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

});


// DELETE TASK
router.delete("/:id", async (req, res) => {

  try {

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

});


module.exports = router;