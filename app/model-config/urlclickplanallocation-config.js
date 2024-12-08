const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class UrlClickPlanAllocationConfig {
  constructor() {
     
    this.fieldMapping = {
      id: "id",
      userId: "userId",
      urlId: "urlId",
      userPlanId: "userPlanId",
      clicksAllocated: "clicksAllocated",
      
      date: "date",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

  
    this.model = db.urlClickPlanAllocation;  
    this.modelName = db.urlClickPlanAllocation.name;  
    this.tableName = db.urlClickPlanAllocation.options.tableName;  

     
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      urlId: this.model.rawAttributes[this.fieldMapping.urlId].field,
      userPlanId: this.model.rawAttributes[this.fieldMapping.userPlanId].field,
      clicksAllocated: this.model.rawAttributes[this.fieldMapping.clicksAllocated].field,

      date: this.model.rawAttributes[this.fieldMapping.date].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    
    this.association = {
      user: "user",     
      url: "url",      
      usersPlans: "usersPlans",  
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
      urlId: (val) => {
        return {
          [`${this.columnMapping.urlId}`]: {
            [Op.eq]: val,
          },
        };
      },
      userPlanId: (val) => {
        return {
          [`${this.columnMapping.userPlanId}`]: {
            [Op.eq]: val,
          },
        };
      },
      clicksAllocatedGreaterThan: (val) => {
        return {
          [`${this.columnMapping.clicksAllocated}`]: {
            [Op.gt]: val,
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

const urlClickPlanAllocationConfig = new UrlClickPlanAllocationConfig();
module.exports = urlClickPlanAllocationConfig;
