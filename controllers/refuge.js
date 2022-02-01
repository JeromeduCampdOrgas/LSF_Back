const models = require("../models");
const fs = require("fs");
const { json } = require("body-parser");

module.exports = {
  createRefuge: function (req, res) {
    let name = req.body.name;
    let attachmentURL = `${req.protocol}://${req.get(
      "host"
    )}/images/refuges/${name}/${req.file.filename}`;

    models.Refuge.findOne({
      attributes: ["name"],
      where: { name: name },
    }).then((refuge) => {
      if (refuge == null) {
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
      } else {
        res.status(201).json({ message: "Le refuge existe déjà" });
      }
    });
  },
  getAllRefuge: async function (req, res) {
    try {
      const refuges = await models.Refuge.findAll({
        attributes: ["id", "name", "imageUrl"],
      });
      res.status(200).send(refuges);
    } catch (error) {
      return res.status(500).send({ error: "Erreur serveur" });
    }
  },
  getOneRefuge: async function (req, res) {
    await models.Refuge.findOne({
      where: { name: req.params.name },
    })
      .then((refuge) => {
        res.status(201).json(refuge);
      })
      .catch(res.status(500).json({ error: "can't find refuge" }));
  },
  updateRefuge: async function (req, res) {
    let name = req.body.name;
    let refugeId = req.params;
    let attachmentURL = `${req.protocol}://${req.get("host")}/images/refuges/${
      req.file.filename
    }`;
    await models.Refuge.update(
      {
        name: name,
        imageUrl: attachmentURL,
      },
      {
        where: {
          id: refugeId,
        },
      }
    )
      .then((newRefuge) => {
        res
          .status(201)
          .json({ message: "Refuge successfully created", newRefuge });
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteRefuge: async function (req, res) {
    let refugeId = req.params.id;
    await models.Refuge.findOne({
      where: {
        id: refugeId,
      },
    })
      .then(() => {
        models.Refuge.destroy({
          where: {
            id: refugeId,
          },
        })
          .then(() => {
            res.status(201).json({ message: "refuge supprimée" });
          })
          .catch(() =>
            res.status(500).json({ message: "une erreur est survenue" })
          );
      })
      .catch(() => res.status(400).json({ message: "Refuge non trouvé" }));
  },
};
