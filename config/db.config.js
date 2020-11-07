/*    Database configuration.    */
const mongoose = require("mongoose");

let configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ironchess";

mongoose
  .connect(MONGODB_URI, configOptions)
  .then(() => {
    console.log("Database `ironchess` is connected.");
  })
  .catch(() => {
    console.log("Something went wrong.");
  });
