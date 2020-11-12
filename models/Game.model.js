/*    Game model.    */
const { Schema, model } = require("mongoose");

let gameSchema = new Schema(
  {
    roomId: String,

    white: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    black: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    movetext: {
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
