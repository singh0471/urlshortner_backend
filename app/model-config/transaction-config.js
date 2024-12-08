const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class TransactionConfig {
  constructor() {
     
    this.fieldMapping = {
      id: "id",
      userId: "userId",
      username:"username",
      planId: "planId",
      planName:"planName",
      amount: "amount",
      date: "date",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

   
    this.model = db.transaction;  
    this.modelName = db.transaction.name;  
    this.tableName = db.transaction.options.tableName;  

     
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      username: this.model.rawAttributes[this.fieldMapping.username].field,
      planId: this.model.rawAttributes[this.fieldMapping.planId].field,
      planName: this.model.rawAttributes[this.fieldMapping.planName].field,
      amount: this.model.rawAttributes[this.fieldMapping.amount].field,
      date: this.model.rawAttributes[this.fieldMapping.date].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

     
    this.association = {
      user: "user",  
      plan: "plan",  
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
      username: (val) => {
        return {
          [`${this.columnMapping.username}`]: {
            [Op.like]: `%${val}%`,
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
      amount: (val) => {
        return {
          [`${this.columnMapping.amount}`]: {
            [Op.eq]: val,
          },
        };
      },
      fromDate: (val) => {
        return {
          [`${this.columnMapping.date}`]: {
            [Op.gte]: val,
          },
        };
      },
      toDate: (val) => {
        return {
          [`${this.columnMapping.date}`]: {
            [Op.lte]: val,
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

const transactionConfig = new TransactionConfig();
module.exports = transactionConfig;
