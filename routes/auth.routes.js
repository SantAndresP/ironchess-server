/*    Authentication routes.    */
const express = require("express");
const router = express.Router();

// bcrypt.js library.
const bcrypt = require("bcryptjs");

// Models.
const UserModel = require("../models/User.model");

// Middleware to check if user is signed in.
const { isLoggedIn } = require("../helpers/auth-helper");

/*    Routes.    */
// Signup.
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(500).json({
      errorMessage: "Please enter username, email and password",
    });
    return;
  }

  // Email validation.
  const myRegex = new RegExp(
    /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  );
  if (!myRegex.test(email)) {
    res.status(500).json({
      errorMessage: "Email format not correct.",
    });
    return;
  }

  // Password validation.
  const myPassRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  );
  if (!myPassRegex.test(password)) {
    res.status(500).json({
      errorMessage:
        "Password needs to have at least 8 characters, a number and an uppercase alphabet letter.",
    });
    return;
  }

  bcrypt.genSalt(12).then((salt) => {
    bcrypt.hash(password, salt).then((passwordHash) => {
      UserModel.create({ email, username, passwordHash })
        .then((user) => {
          user.passwordHash = "***";
          req.session.loggedInUser = user;
          res.status(200).json(user);
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(500).json({
              errorMessage: "The username or email entered already exists.",
            });
            return;
          } else {
            res.status(500).json({
              errorMessage: "Something went wrong. Check up with the admin.",
            });
            return;
          }
        });
    });
  });
});

// Signin.
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500).json({
      error: "Please enter Username. email and password",
    });
    return;
  }
  const myRegex = new RegExp(
    /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  );
  if (!myRegex.test(email)) {
    res.status(500).json({
      error: "Email format not correct",
    });
    return;
  }

  // Finds if the user exists in the database.
  UserModel.findOne({ email })
    .then((userData) => {
      // Checks if passwords match.
      bcrypt
        .compare(password, userData.passwordHash)
        .then((doesItMatch) => {
          if (doesItMatch) {
            userData.passwordHash = "***";
            req.session.loggedInUser = userData;
            console.log("Signin", req.session);
            res.status(200).json(userData);
          } else {
            res.status(500).json({
              error: "Passwords don't match",
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).json({
            error: "Email format not correct",
          });
          return;
        });
    })

    // Throws an error if the user does not exists.
    .catch((err) => {
      res.status(500).json({
        error: "User doesn't exist.",
        message: err,
      });
      return;
    });
});

// Log out.
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).send();
});

// User.
router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

module.exports = router;
