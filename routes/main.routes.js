/*    Main routes.    */

// Setup.
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../helpers/auth-helper");
const GameModel = require("../models/Game.model");
const UserModel = require("../models/User.model");

// Routes.
router.get("/games", isLoggedIn, (req, res) => {
  const userId = req.session.loggedInUser._id;

  GameModel.find({ $or: [{ black: userId }, { white: userId }] })
    .populate("white")
    .populate("black")
    .then((searchResult) => {
      const results = searchResult.map((result) => {
        return {
          roomId: result.roomId,
          white: result.white.username,
          black: result.black ? result.black.username : null,
          movetext: result.movetext,
        };
      });

      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.patch("/edit", isLoggedIn, (req, res) => {
  const userId = req.session.loggedInUser._id;
  const { about, image } = req.body;

  UserModel.findByIdAndUpdate(userId, { about: about, image: image }).then(
    (update) => {
      res.status(200).json(update);
    }
  );
});

module.exports = router;
