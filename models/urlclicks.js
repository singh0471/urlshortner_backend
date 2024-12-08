'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class urlClick extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each UrlClick belongs to a specific user and a specific URL
      urlClick.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      urlClick.belongsTo(models.url, {
        foreignKey: 'urlId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  urlClick.init(
    {
      
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      urlId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      modelName: 'urlClick',
      underscored: true,
      paranoid: true,
       
    }
  );

  return urlClick;
};
