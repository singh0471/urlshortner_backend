'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
         
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,  
      },
      type: {
        type: Sequelize.ENUM('url', 'clicks','combo'),
        allowNull: false,
      },
      url_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      custom_url_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      clicks_per_url: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      number_of_urls_renewed: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      total_clicks_per_url: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plans');
  }
};
