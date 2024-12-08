const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class PlanConfig {
  constructor() {
     
    this.fieldMapping = {
      id: "id",
      name: "name",
      description: "description",
      type: "type",
      urlLimit: "urlLimit",
      customUrlLimit: "customUrlLimit",
      clicksPerUrl: "clicksPerUrl",
      numberOfUrlsRenewed: "numberOfUrlsRenewed",
      totalClicksPerUrl: "totalClicksPerUrl",
      amount: "amount",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };
 
    this.model = db.plan;  
    this.modelName = db.plan.name;  
    this.tableName = db.plan.options.tableName;  

    
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      name: this.model.rawAttributes[this.fieldMapping.name].field,
      description: this.model.rawAttributes[this.fieldMapping.description].field,
      type: this.model.rawAttributes[this.fieldMapping.type].field,
      urlLimit: this.model.rawAttributes[this.fieldMapping.urlLimit].field,
      customUrlLimit: this.model.rawAttributes[this.fieldMapping.customUrlLimit].field,
      clicksPerUrl: this.model.rawAttributes[this.fieldMapping.clicksPerUrl].field,
      numberOfUrlsRenewed: this.model.rawAttributes[this.fieldMapping.numberOfUrlsRenewed].field,
      totalClicksPerUrl: this.model.rawAttributes[this.fieldMapping.totalClicksPerUrl].field,
      amount: this.model.rawAttributes[this.fieldMapping.amount].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };
    
     
    this.association = {
      usersPlans: "usersPlans", 
      transactions: "transactions",  
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
      name: (val) => {
        return {
          [`${this.columnMapping.name}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      description: (val) => {
        return {
          [`${this.columnMapping.description}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      type: (val) => {
        return {
          [`${this.columnMapping.type}`]: {
            [Op.eq]: val,
          },
        };
      },
      urlLimit: (val) => {
        return {
          [`${this.columnMapping.urlLimit}`]: {
            [Op.eq]: val,
          },
        };
      },
      customUrlLimit: (val) => {
        return {
          [`${this.columnMapping.customUrlLimit}`]: {
            [Op.eq]: val,
          },
        };
      },
      clicksPerUrl: (val) => {
        return {
          [`${this.columnMapping.clicksPerUrl}`]: {
            [Op.eq]: val,
          },
        };
      },
      numberOfUrlsRenewed: (val) => {
        return {
          [`${this.columnMapping.numberOfUrlsRenewed}`]: {
            [Op.eq]: val,
          },
        };
      },
      totalClicksPerUrl: (val) => {
        return {
          [`${this.columnMapping.totalClicksPerUrl}`]: {
            [Op.eq]: val,
          },
        };
      },
      amount: (val) => {
        return {
          [`${this.columnMapping.amount}`]: {
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
      createdAtLessThan: (val) => {
        return {
          [`${this.columnMapping.createdAt}`]: {
            [Op.lt]: val,
          },
        };
      },
      updatedAtGreaterThan: (val) => {
        return {
          [`${this.columnMapping.updatedAt}`]: {
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

const planConfig = new PlanConfig();
module.exports = planConfig;
