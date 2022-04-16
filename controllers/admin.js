//Imports
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtVerif = require("../functions/jwt_verif");
require("dotenv").config();
//const token = require("../middleware/token"); // module qui génère le token
const { Op } = require("sequelize");

module.exports = {
  //users
  deleteUser: function (req, res) {
    let id = req.params.id;
    models.User.destroy({ where: { id: id } });
  },
  updateUser: async function (req, res) {
    //console.log(req.body);
    let id = req.params.id;
    let user = await models.User.findOne({ where: { id: id } });

    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.isAdmin) {
      user.isAdmin = req.body.isAdmin;
    }

    const newUser = await user.save({
      fields: ["username", "email", "isAdmin"],
    });
    res.status(200).json({
      user: newUser,
      messageRetour: "Le profil a bien été modifié",
    });
  },
  createUser: function (req, res) {
    console.log(req.body);
  },
};
