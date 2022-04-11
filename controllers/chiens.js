const models = require("../models");
const { json } = require("body-parser");
const fs = require("fs");
const express = require("express");
const path = require("path");
const chemin = process.cwd() + "/images/chienCarousel";
("c:/users/ducam/onedrive/bureau/lsf/lsf_back/images/chienCarousel");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
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
  },
  updateChien: function (req, res) {
    let id = req.params.id;

    models.Chien.update(
      {
        puce: req.body.puce,
        sexe: req.body.sexe,
        age: req.body.age,
        taille: req.body.taille,
        chats: req.body.chats,
        sante: req.body.sante,
        statut: req.body.statut,
        commentaires: req.body.commentaires,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((newChien) => {
        res
          .status(201)
          .json({ message: "Chien successfully updated", newChien });
      })
      .catch((err) => console.log(err));
  },
  getAllChiens: async function (req, res) {
    try {
      const chiens = await models.Chien.findAll({});
      res.status(200).send(chiens);
    } catch (error) {
      return res.status(501).send({ error: "Erreur serveur" });
    }
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
    let refugeId = req.body.refugeId;
    let nom = req.body.nom;
    let chienId = req.body.chienId;

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
      }
      return res.status(201).json({ message: "C'est tout bon" });
    } catch (error) {
      return res.status(501).send({ error: "Erreur serveur" });
    }
  },
  chiensCarousel: async function (req, res) {
    let chienId = req.params.chienId;
    console.log(chienId);
    try {
      const carousel = await models.ChiensCarousel.findAll({
        where: { chienId: chienId },
      });

      return res.status(200).json(carousel);
    } catch (error) {
      return res.status(501).send({ error: "Erreur serveur" });
    }
  },
  chiensCarouselSuppr: function (req, res) {
    let imageId = req.params.id;
    {
      models.ChiensCarousel.findOne({
        where: { id: imageId },
      }).then((image) => {
        let chaine = image.images;
        let debut = chaine.indexOf("IMG");
        let fin = chaine.lastIndexOf(".JPG") + 4;
        let longueur = fin - debut;
        let newChaine = chaine.substr(debut, longueur);
        /************************* */

        fs.unlink(`${chemin}/${newChaine}`, () => {
          models.ChiensCarousel.destroy({
            where: { id: imageId },
          })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) =>
              res
                .status(400)
                .json({ error: "Impossible de supprimer le message" })
            );
        });
      });
    }
  },
};
