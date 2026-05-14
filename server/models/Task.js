const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    assignedTo: {
      type: String,
    },

    // CONNECT TASK TO TEAM
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    dueDate: {
      type: Date,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);