const models = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
  searchDog: function (req, res) {
    console.log("coucou");

    let nom = req.params.nom;
    models.Chien.findAll({
      where: {
        nom: {
          [Op.like]: `%${nom}%`,
        },
      },
      group: ["nom"],
    })
      .then((recherche) => {
        console.log(recherche);
        res.status(200).send(recherche);
      })
      .catch((err) => console.log(err));
  },
};
