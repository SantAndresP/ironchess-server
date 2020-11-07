/*    User model.    */
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter an username."],
    },

    email: {
      type: String,
      required: [true, "Please enter an email."],
    },

    passwordHash: {
      type: String,
      required: true,
    },

    games: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },

    elo: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Ensures that both email and username are unique.
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

module.exports = model("User", userSchema);
