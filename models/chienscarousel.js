'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiensCarousel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChiensCarousel.init({
    nom: DataTypes.STRING,
    chienId: DataTypes.INTEGER,
    refugeId: DataTypes.INTEGER,
    images: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChiensCarousel',
  });
  return ChiensCarousel;
};