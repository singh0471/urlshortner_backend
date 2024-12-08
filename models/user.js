'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      user.hasMany(models.url, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      user.hasMany(models.usersPlans, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      user.hasMany(models.urlClick, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      user.hasMany(models.query, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      user.hasMany(models.transaction, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      user.hasMany(models.transaction, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      user.hasOne(models.urlClickPlanAllocation, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  user.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
      },
       password:{
        type: DataTypes.STRING,
        allowNull:false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'blacklisted', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      totalRevenue:{
        type :DataTypes.FLOAT,
        allowNull:false,
      
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
      modelName: 'user',
      underscored: true,
      paranoid: true,  
       
    }
  );
  return user;
};
