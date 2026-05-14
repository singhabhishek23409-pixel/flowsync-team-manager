const express = require("express");
const router = express.Router();

const Team = require("../models/Team");


// CREATE TEAM
router.post("/", async (req, res) => {

  try {

    const { name, description } =
      req.body;

    const newTeam =
      new Team({

        name,

        description,

        members: [],

      });

    await newTeam.save();

    res.status(201).json(newTeam);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });

  }

});


// GET TEAMS
router.get("/", async (req, res) => {

  try {

    const email =
      req.headers.email;

    const role =
      req.headers.role?.toLowerCase();

    const name =
      req.headers.name;

    let teams;

    // IF NO HEADERS → RETURN ALL TEAMS
    if (!email && !role && !name) {

      teams =
        await Team.find().sort({
          createdAt: -1,
        });

    }

    // ADMIN CAN SEE ALL
    else if (role === "admin") {

      teams =
        await Team.find().sort({
          createdAt: -1,
        });

    }

    else {

      // NORMAL USER ONLY SEES OWN TEAMS
      teams =
        await Team.find({

          $or: [

            {
              "members.email":
                email,
            },

            {
              "members.name":
                name,
            },

          ],

        }).sort({
          createdAt: -1,
        });

    }

    res.json(teams);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });

  }

});


// ADD MEMBER
router.put("/:id/member", async (req, res) => {

  try {

    const {
      name,
      email,
      role,
    } = req.body;

    const team =
      await Team.findById(
        req.params.id
      );

    if (!team) {

      return res.status(404).json({
        message:
          "Team not found",
      });

    }

    // CHECK IF MEMBER EXISTS
    const alreadyExists =
      team.members.find(
        (member) =>

          member.email ===
          email

          ||

          member.name ===
          name
      );

    if (alreadyExists) {

      return res.status(400).json({
        message:
          "Member already exists",
      });

    }

    // ADD MEMBER
    team.members.push({

      name,

      email,

      role,

    });

    await team.save();

    res.json(team);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });

  }

});


// DELETE TEAM
router.delete("/:id", async (req, res) => {

  try {

    await Team.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Team deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });

  }

});


module.exports = router;