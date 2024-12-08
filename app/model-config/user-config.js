const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class UserConfig {
  constructor() {
     
    this.fieldMapping = {
      id: "id",
      username:"username",
      firstName: "firstName",
      lastName: "lastName",
      password:"password",
      email: "email",
      status: "status",
      isAdmin: "isAdmin",
      totalRevenue:"totalRevenue",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

    
    this.model = db.user;  
    this.modelName = db.user.name;  
    this.tableName = db.user.options.tableName;  
    
     
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      username: this.model.rawAttributes[this.fieldMapping.username].field,
      password: this.model.rawAttributes[this.fieldMapping.password].field,
      firstName: this.model.rawAttributes[this.fieldMapping.firstName].field,
      lastName: this.model.rawAttributes[this.fieldMapping.lastName].field,
      email: this.model.rawAttributes[this.fieldMapping.email].field,
      status: this.model.rawAttributes[this.fieldMapping.status].field,
      isAdmin: this.model.rawAttributes[this.fieldMapping.isAdmin].field,
      totalRevenue: this.model.rawAttributes[this.fieldMapping.totalRevenue].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    
    this.association = {
      urls: "urls",  
      usersPlans: "usersPlans",  
      urlClicks: "urlClicks",  
      queries: "queries",  
      transactions: "transactions",  
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

      username: (val) => {
        return {
          [`${this.columnMapping.username}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      
      firstName: (val) => {
        return {
          [`${this.columnMapping.firstName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      lastName: (val) => {
        return {
          [`${this.columnMapping.lastName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      email: (val) => {
        return {
          [`${this.columnMapping.email}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      status: (val) => {
        return {
          [`${this.columnMapping.status}`]: {
            [Op.eq]: val
          },
        };
      },
      isAdmin: (val) => {
        return {
          [`${this.columnMapping.isAdmin}`]: {
            [Op.eq]: val,
          },
        };
      },
      fromTotalRevenue: (val) => {
        return {
          [`${this.columnMapping.isAdmin}`]: {
            [Op.gte]: val,
          },
        };
      },

      toTotalRevenue: (val) => {
        return {
          [`${this.columnMapping.isAdmin}`]: {
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

const userConfig = new UserConfig();
module.exports = userConfig;
