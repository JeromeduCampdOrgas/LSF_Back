'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Chiens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      taille: {
        type: Sequelize.STRING
      },
      puce: {
        type: Sequelize.STRING
      },
      sexe: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.STRING
      },
      sante: {
        type: Sequelize.STRING
      },
      commentaires: {
        type: Sequelize.STRING
      },
      chats: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Chiens');
  }
};