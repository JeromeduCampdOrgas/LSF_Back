const multer = require("multer");
const fs = require("fs");
const { json } = require("body-parser");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/chienCarousel");
  },

  filename: (req, file, cb) => {
    //const extension = MIME_TYPES[file.mimetype];
    //const name = req.file.split(" ").join("_") + "." + extension;

    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
module.exports = multer({ storage: storage }).array("carousel", 5);
