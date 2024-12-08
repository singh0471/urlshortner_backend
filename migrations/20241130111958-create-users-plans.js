'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users_plans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
         
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',  
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plans',  
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      plan_name:{
        type: Sequelize.STRING,
        allowNull:false
      },
      plan_type:{
        type: Sequelize.STRING,
        allowNull:false
      },
      total_url: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      total_custom_url: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      total_clicks_per_url: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      url_left: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      custom_url_left: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      url_renew_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      url_renew_left: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      click_per_url_renew: {
        type: Sequelize.INTEGER,
        allowNull: true,  
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      plan_type: {
        type: Sequelize.ENUM('url', 'clicks','combo'),
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
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users_plans');
  },
};
