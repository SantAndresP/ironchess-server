/*    Cloudinary configuration.    */
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "santacloud",
  api_key: "128982863794145",
  api_secret: "6CWvFwph8yKB0GDXDSJ8fl3AWPY",
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: "ironchess",
  allowedFormats: ["jpg", "png"],
  filename: function (req, res, cb) {
    cb(null, res.originalname);
  },
});

module.exports = multer({ storage });
