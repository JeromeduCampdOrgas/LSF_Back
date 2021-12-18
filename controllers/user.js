//Imports
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtVerif = require("../functions/jwt_verif");
require("dotenv").config();
//const token = require("../middleware/token"); // module qui génère le token
const { Op } = require("sequelize");

// Routes

exports.signup = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (user !== null) {
      if (user.email === req.body.email) {
        return res.status(400).json({ error: "Ce compte existe déjà" });
      }
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = await models.User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        admin: false,
      });

      res.status(201).json({
        message: `Votre compte est bien créé ${newUser.username} !`,
      });
    }
  } catch (error) {
    return res.status(400).send({ error: "Impossible de créer le compte" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { email: req.body.email },
    }); // on vérifie que l'adresse mail figure bien dan la bdd
    if (user === null) {
      return res.status(403).json({ error: "Connexion échouée" });
    } else {
      const hash = await bcrypt.compare(req.body.password, user.password); // on compare les mots de passes
      if (!hash) {
        return res.status(401).json({ error: "Mot de passe incorrect !" });
      } else {
        res.status(200).json({
          // on renvoie le user et le token
          user: user,
          token: jwt.sign(
            {
              userId: user.id,
              username: user.username,
              email: user.email,
              isAdmin: user.isAdmin,
            },
            "RANDOM_TOKEN_SECRET",
            {
              expiresIn: "24h",
            }
          ),
          message: "Bonjour " + user.username + " !" + " : ",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.getAccount = async (req, res) => {
  // on trouve l'utilisateur et on renvoie l'objet user

  try {
    const user = await models.User.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};
exports.getAllUsers = async (req, res) => {
  // on envoie tous les users sauf admin
  try {
    const users = await models.User.findAll({
      attributes: ["username", "id", "image", "email"],
    });
    res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};
exports.updateAccount = async (req, res) => {
  // modifier le profil
  const id = req.params.id;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    let newPhoto;
    let user = await models.User.findOne({ where: { id: id } }); // on trouve le user
    if (userId === user.id || isAdmin === isAdmin) {
      if (req.file && user.image) {
        newPhoto = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
        const filename = user.image.split("/upload")[1];
        fs.unlink(`upload/${filename}`, (err) => {
          // s'il y avait déjà une photo on la supprime
          if (err) console.log(err);
          else {
            console.log(`Deleted file: upload/${filename}`);
          }
        });
      } else if (req.file) {
        newPhoto = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
      }
      if (newPhoto) {
        user.image = newPhoto;
      }
      if (req.body.username) {
        user.username = req.body.username;
      }
      const newUser = await user.save({ fields: ["username", "image"] }); // on sauvegarde les changements dans la bdd
      res.status(200).json({
        user: newUser,
        messageRetour: "Votre profil a bien été modifié",
      });
    } else {
      res
        .status(400)
        .json({ messageRetour: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await models.User.findOne({ where: { id: id } });
    if (user.image !== null) {
      const filename = user.image.split("/upload")[1];
      fs.unlink(`upload/${filename}`, () => {
        // sil' y a une photo on la supprime et on supprime le compte
        models.User.destroy({ where: { id: id } });
        res.status(200).json({ messageRetour: "utilisateur supprimé" });
      });
    } else {
      models.User.destroy({ where: { id: id } }); // on supprime le compte
      res.status(200).json({ messageRetour: "utilisateur supprimé" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};
