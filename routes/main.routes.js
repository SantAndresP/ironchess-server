/*    Main routes.    */
const express = require("express");
const router = express.Router();

const GameModel = require("../models/Game.model");

const { isLoggedIn } = require("../helpers/auth-helper");

/*    Routes.    */
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

module.exports = router;
