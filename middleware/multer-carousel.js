const multer = require("multer");
const models = require("../models");
const fs = require("fs");
const { json } = require("body-parser");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const refuge = req.body.refuge;

    const dest = "images/refuges/" + refuge + "/" + req.body.nom + "/carousel";
    fs.access(dest, function (error) {
      if (error) {
        console.log("Directory does not exist.");
        return fs.mkdir(dest, (error) => cb(error, dest));
      } else {
        console.log("Directory exists.");
        return cb(null, dest);
      }
    });
  },

  filename: (req, file, cb) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = req.body.name.split(" ").join("_") + "." + extension;
    cb(null, name);
  },
});
module.exports = multer({ storage: storage }).single("picture");
