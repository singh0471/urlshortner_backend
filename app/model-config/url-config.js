const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class UrlConfig {
  constructor() {
     
    this.fieldMapping = {
      id: "id",
      userId: "userId",
      username:"username",
      actualUrl: "actualUrl",
      shortUrl: "shortUrl",
      isCustom: "isCustom",
      clicksLeft: "clicksLeft",
      totalClicks:"totalClicks",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

  
    this.model = db.url;  
    this.modelName = db.url.name;  
    this.tableName = db.url.options.tableName;  

     
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      username: this.model.rawAttributes[this.fieldMapping.username].field,
      actualUrl: this.model.rawAttributes[this.fieldMapping.actualUrl].field,
      shortUrl: this.model.rawAttributes[this.fieldMapping.shortUrl].field,
      isCustom: this.model.rawAttributes[this.fieldMapping.isCustom].field,
      clicksLeft: this.model.rawAttributes[this.fieldMapping.clicksLeft].field,
      totalClicks: this.model.rawAttributes[this.fieldMapping.totalClicks].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    
    this.association = {
      user: "user",  
      urlClicks: "urlClick",  
      urlClickPlanAllocations: "urlClickPlanAllocation",  
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
      actualUrl: (val) => {
        return {
          [`${this.columnMapping.actualUrl}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      shortUrl: (val) => {
        return {
          [`${this.columnMapping.shortUrl}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      isCustom: (val) => {
        return {
          [`${this.columnMapping.isCustom}`]: {
            [Op.eq]: val,
          },
        };
      },
      clicksLeft: (val) => {
        return {
          [`${this.columnMapping.clicksLeft}`]: {
            [Op.eq]: val,
          },
        };
      }, fromClicksLeft: (val) => {
        return {
          [`${this.columnMapping.clicksLeft}`]: {
            [Op.gte]: val,
          },
        };
      }
      , toClicksLeft: (val) => {
        return {
          [`${this.columnMapping.clicksLeft}`]: {
            [Op.lte]: val,
          },
        };
      },
      fromTotalClicks: (val) => {
        return {
          [`${this.columnMapping.totalClicks}`]: {
            [Op.gte]: val,
          },
        };
      }
      , toTotalClicks: (val) => {
        return {
          [`${this.columnMapping.totalClicks}`]: {
            [Op.lte]: val,
          },
        };
      },

      totalClicks: (val) => {
        return {
          [`${this.columnMapping.clicksLeft}`]: {
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

const urlConfig = new UrlConfig();
module.exports = urlConfig;
