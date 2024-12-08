'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
      // Define associations here
      plan.hasMany(models.usersPlans, {
        foreignKey: 'planId',
        onDelete: 'NO ACTION',
        hooks: true,
      });

      plan.hasMany(models.transaction, {
        foreignKey: 'planId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  plan.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,   
      },
      type: {
        type: DataTypes.ENUM('url', 'clicks','combo'),
        allowNull: false,
      },
      urlLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      customUrlLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      clicksPerUrl: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      numberOfUrlsRenewed: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      totalClicksPerUrl: {
        type: DataTypes.INTEGER,
        allowNull: true,  
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'plan',
      underscored: true,   
      paranoid:true
    }
  );

  return plan;
};
