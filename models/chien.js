"use strict";
module.exports = (sequelize, DataTypes) => {
  var Chien = sequelize.define(
    "Chien",
    {
      refugeId: DataTypes.INTEGER,
      nom: DataTypes.STRING,
      taille: DataTypes.STRING,
      puce: DataTypes.STRING,
      sexe: DataTypes.STRING,
      age: DataTypes.STRING,
      sante: DataTypes.STRING,
      commentaires: DataTypes.STRING,
      chats: DataTypes.STRING,
      statut: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          models.Chien.belongsTo(models.refuge, {
            foreignKey: {
              allowNull: false,
            },
          });
          models.Chien.hasMany(models.chiencarousel, {
            foreignKey: "chienId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            hooks: true,
          });
        },
      },
    }
  );
  return Chien;
};
