/*    File upload routes.    */
const express = require("express");
const router = express.Router();

// Cloudinary configuration.
const uploader = require("../config/cloud.config.js");

/*    Routes.    */
router.post("/upload", uploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ image: req.file.path });
});

module.exports = router;
