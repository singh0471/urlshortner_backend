'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('queries', {
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
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      admin_response: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('submitted', 'pending', 'responded'),
        allowNull: false,
        defaultValue: 'submitted',  
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
    await queryInterface.dropTable('queries');
  },
};