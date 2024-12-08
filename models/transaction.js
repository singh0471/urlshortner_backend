'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each transaction belongs to a single user and plan
      transaction.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      transaction.belongsTo(models.plan, {
        foreignKey: 'planId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  transaction.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
          
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      planName: {
        type: DataTypes.STRING,
        allowNull: false,
          
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
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
      modelName: 'transaction',
      underscored: true,
      paranoid: true
    }
  );
  return transaction;
};
