'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
      // Define associations here
      url.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      url.hasMany(models.urlClick, {
        foreignKey: 'urlId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      url.hasMany(models.urlClickPlanAllocation, {
        foreignKey: 'urlId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  url.init(
    {
       
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id', 
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      actualUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shortUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isCustom: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      clicksLeft: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalClicks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      modelName: 'url',
      underscored: true,   
      paranoid: true,   
    }
  );

  return url;
};
