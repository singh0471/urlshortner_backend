'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('url_click_plan_allocations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      url_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'urls', 
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users_plans', 
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      clicks_allocated: {
        type: Sequelize.INTEGER,
        allowNull: false,
     
      },
      
      date: {
        type: Sequelize.DATEONLY,
        defaultValue:Sequelize.NOW
 
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
    await queryInterface.dropTable('url_click_plan_allocations');
  },
};
