const models = require("../models");
const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
};

module.exports = {
  createChien: function (req, res) {
    let refuge = req.body.refuge;
    let refugeId = req.body.refugeId;
    let name = req.body.name;
    let puce = req.body.puce;
    let sexe = req.body.sexe;
    let age = req.body.age;
    let taille = req.body.taille;
    let chat = req.body.chat;
    let statut = req.body.statut;
    let attachmentURL = `${req.protocol}://${req.get(
      "host"
    )}/images/refuges/${refuge}/${name}/${req.file.filename}`;
    models.Chien.findOne({
      where: { nom: name, refugeId: refugeId },
    }).then((chien) => {
      if (chien == null) {
        models.Chien.create({
          refugeId: refugeId,
          nom: name,
          puce: puce,
          sexe: sexe,
          age: age,
          taille: taille,
          chats: chat,
          statut: statut,
          imageUrl: attachmentURL,
        })
          .then((newChien) => {
            res
              .status(201)
              .json({ message: "Chien successfully created", newChien });
          })
          .catch((err) => res.status(500).json(err));
      } else {
        res.status(201).json({ message: "Ce chien existe déjà" });
      }
    });
  },
  getAllChiensOneRefuge: async function (req, res) {
    //let refugeId = req.params.refugeId;

    try {
      const chiens = await models.Chien.findAll({
        where: { refugeId: req.params.refugeId },
      });
      res.status(200).send(chiens);
    } catch (error) {
      return res.status(501).send({ error: "Erreur serveur" });
    }
  },
  carousel: async function (req, res) {
    console.log("coucou");
    console.log(req.body);
    console.log(req.files);

    let refugeId = req.body.refugeId;
    let nom = req.body.nom;
    let chienId = req.body.chienId;

    console.log(nom);
    try {
      for (let i = 0; i < req.files.length; i++) {
        let attachmentURL = `${req.protocol}://${req.get(
          "host"
        )}/images/chiencarousel/${req.files[i].filename}`;
        await models.ChiensCarousel.create({
          nom: nom,
          chienId: chienId,
          refugeId: refugeId,
          images: attachmentURL,
        });
        /*.then(() => {
            return res.status(200).send({ status: 0, message: "Tout est ok" });
          })
          .catch(() => {
            return res.status(500).send({ status: 1, message: "Tout est ok" });
          });*/
      }
    } catch (error) {
      return res.status(501).send({ error: "Erreur serveur" });
    }
  },
};
