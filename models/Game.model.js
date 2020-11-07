/*    Game model.    */
const { Schema, model } = require("mongoose");

let gameSchema = new Schema(
  {
    white: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    black: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    Movetext: {
      type: Object,
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
