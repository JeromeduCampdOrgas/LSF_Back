const multer = require("multer");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = "images/refuges/" + req.body.name; // + "/chiens";

    fs.access(dest, function (error) {
      if (error) {
        console.log(dest);
        console.log("Directory does not exist.");
        fs.mkdir(dest, (error) => cb(error, dest));
      } else {
        console.log("Directory exists.");
        return cb(null, dest);
      }
    });
  },

  filename: (req, file, callback) => {
    const name = req.body.name.split(" ").join("_") + ".jpg";
    callback(null, name);
  },
});

module.exports = multer({ storage: storage }).single("picture");
