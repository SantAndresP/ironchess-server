/*    Game model.    */
const { Schema, model } = require("mongoose");

let gameSchema = new Schema(
  {
    roomId: String,

    white: {
      type: String,
    },

    black: {
      type: String,
    },

    Movetext: {
      type: String,
    },

    result: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Game", gameSchema);
