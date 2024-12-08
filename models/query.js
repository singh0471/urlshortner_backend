'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class query extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each Query belongs to a User
      query.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  query.init(
    {
    
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      query: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      adminResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('submitted', 'pending', 'responded'),
        allowNull: false,
        defaultValue: 'submitted',
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
      modelName: 'query',
      underscored: true,
      paranoid: true
    }
  );

  return query;
};

