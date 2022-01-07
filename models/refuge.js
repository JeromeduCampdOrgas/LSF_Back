"use strict";

const { STRING } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Refuge = sequelize.define(
    "Refuge",
    {
      name: DataTypes.STRING,
    },
    {
      classMethods: {
        associate: function (models) {
          models.Refuge.hasMany(models.chien, {
            foreignKey: "refugeId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            hooks: true,
          });
        },
      },
    }
  );
  return Refuge;
};
