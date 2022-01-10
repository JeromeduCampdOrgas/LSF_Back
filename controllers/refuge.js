const models = require("../models");
const fs = require("fs");

module.exports = {
  createRefuge: function (req, res) {
    console.log("coucou");
    let name = req.body.name;

    let attachmentURL = `${req.protocol}://${req.get("host")}/images/refuges${
      req.file.filename
    }`;
    console.log(attachmentURL);
    models.Refuge.create({
      name: name,
      imageUrl: attachmentURL,
    })
      .then((newRefuge) => {
        res
          .status(201)
          .json({ message: "Refuge successfully created", newRefuge });
      })
      .catch((err) => res.status(500).json(err));
  },
};
