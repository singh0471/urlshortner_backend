'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class usersPlans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A user plan belongs to a specific user
      usersPlans.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      // A user plan belongs to a specific plan
      usersPlans.belongsTo(models.plan, {
        foreignKey: 'planId',
        onDelete: 'NO ACTION',
        hooks: true,
      });

      // A user plan can have many URL Click Plan Allocations (if click plans)
      usersPlans.hasMany(models.urlClickPlanAllocation, {
        foreignKey: 'userPlanId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  usersPlans.init(
    {
      id: {
        type: DataTypes.UUID,
        
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      planName:{
        type: DataTypes.STRING,
        allowNull:false
      },
      planType:{
        type: DataTypes.STRING,
        allowNull:false
      },
      totalUrl: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      totalCustomUrl: {
        type: DataTypes.INTEGER,
        allowNull: true, 
      },
      totalClicksPerUrl: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      urlLeft: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      customUrlLeft: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      
      urlRenewLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      urlRenewLeft: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      clickPerUrlRenew: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      planType: {
        type: DataTypes.ENUM('url', 'clicks','combo'),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'usersPlans',
      underscored: true,
      paranoid: true
    }
  );

  return usersPlans;
};
