const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class UsersPlansConfig {
  constructor() {
  
    this.fieldMapping = {
      id: "id",
      userId: "userId",
      planId: "planId",
      planName:"planName",
      planType:"planType",
      totalUrl: "totalUrl",
      totalCustomUrl: "totalCustomUrl",
      totalClicksPerUrl: "totalClicksPerUrl",
      urlLeft: "urlLeft",
      customUrlLeft: "customUrlLeft",
      
      urlRenewLimit: "urlRenewLimit",
      urlRenewLeft:"urlRenewLeft",
      clickPerUrlRenew: "clickPerUrlRenew",
      amount: "amount",
      planType: "planType",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

 
    this.model = db.usersPlans;  
    this.modelName = db.usersPlans.name; 
    this.tableName = db.usersPlans.options.tableName;  

  
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      planId: this.model.rawAttributes[this.fieldMapping.planId].field,
      planName: this.model.rawAttributes[this.fieldMapping.planName].field,
      planType: this.model.rawAttributes[this.fieldMapping.planType].field,
      totalUrl: this.model.rawAttributes[this.fieldMapping.totalUrl].field,
      totalCustomUrl: this.model.rawAttributes[this.fieldMapping.totalCustomUrl].field,
      totalClicksPerUrl: this.model.rawAttributes[this.fieldMapping.totalClicksPerUrl].field,
      urlLeft: this.model.rawAttributes[this.fieldMapping.urlLeft].field,
      customUrlLeft: this.model.rawAttributes[this.fieldMapping.customUrlLeft].field,
      urlRenewLimit: this.model.rawAttributes[this.fieldMapping.urlRenewLimit].field,
      urlRenewLeft : this.model.rawAttributes[this.fieldMapping.urlRenewLeft].field,
      clickPerUrlRenew: this.model.rawAttributes[this.fieldMapping.clickPerUrlRenew].field,
      amount: this.model.rawAttributes[this.fieldMapping.amount].field,
      planType: this.model.rawAttributes[this.fieldMapping.planType].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    
    this.association = {
      user: "user",  
      plan: "plan",     
      urlClickPlanAllocations: "urlClickPlanAllocations",  
    };

    
    this.filters = {
      id: (val) => {
        validateUUID(val);
        return {
          [`${this.columnMapping.id}`]: {
            [Op.eq]: val,
          },
        };
      },
      userId: (val) => {
        return {
          [`${this.columnMapping.userId}`]: {
            [Op.eq]: val,
          },
        };
      },
      planId: (val) => {
        return {
          [`${this.columnMapping.planId}`]: {
            [Op.eq]: val,
          },
        };
      },
      planName: (val) => {
        return {
          [`${this.columnMapping.planName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      planType: (val) => {
        return {
          [`${this.columnMapping.planType}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      totalUrlGreaterThan: (val) => {
        return {
          [`${this.columnMapping.totalUrl}`]: {
            [Op.gt]: val,
          },
        };
      },
      totalCustomUrlGreaterThan: (val) => {
        return {
          [`${this.columnMapping.totalCustomUrl}`]: {
            [Op.gt]: val,
          },
        };
      },
      amountGreaterThan: (val) => {
        return {
          [`${this.columnMapping.amount}`]: {
            [Op.gt]: val,
          },
        };
      },
      planType: (val) => {
        return {
          [`${this.columnMapping.planType}`]: {
            [Op.eq]: val,
          },
        };
      },
      createdAtGreaterThan: (val) => {
        return {
          [`${this.columnMapping.createdAt}`]: {
            [Op.gt]: val,
          },
        };
      },
      updatedAtLessThan: (val) => {
        return {
          [`${this.columnMapping.updatedAt}`]: {
            [Op.lt]: val,
          },
        };
      },
    };
  }
}

const usersPlansConfig = new UsersPlansConfig();
module.exports = usersPlansConfig;
