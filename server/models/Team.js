const mongoose = require("mongoose");

const teamSchema =
  new mongoose.Schema(

    {

      name: {

        type: String,

        required: true,

      },

      description: {

        type: String,

        default: "",

      },

      members: [

        {

          name: String,

          email: String,

          role: String,

        },

      ],

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(
    "Team",
    teamSchema
  );