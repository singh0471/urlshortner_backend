'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class urlClickPlanAllocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       
      urlClickPlanAllocation.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      });

 
      urlClickPlanAllocation.belongsTo(models.url, {
        foreignKey: 'urlId',
        onDelete: 'CASCADE',
        hooks: true,
      });

 
      urlClickPlanAllocation.belongsTo(models.usersPlans, {
        foreignKey: 'userPlanId',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }

  urlClickPlanAllocation.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      urlId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userPlanId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      clicksAllocated: {
        type: DataTypes.INTEGER,
        allowNull: false,
 
      },
      
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,  
      }
    },
    {
      sequelize,
      modelName: 'urlClickPlanAllocation',
      underscored: true,   
      paranoid: true,  
    }
  );
  return urlClickPlanAllocation;
};
