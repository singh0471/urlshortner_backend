'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('url_clicks', {
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
      url_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'urls',  
          key: 'id',
        },
        onDelete: 'CASCADE',  
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('url_clicks');
  },
};
