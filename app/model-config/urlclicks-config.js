const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class UrlClickConfig {
  constructor() {
     
    this.fieldMapping = {
      id: "id",
      userId: "userId",
      urlId: "urlId",
      date: "date",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

 
    this.model = db.urlClick; 
    this.modelName = db.urlClick.name; 
    this.tableName = db.urlClick.options.tableName;  

    
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      urlId: this.model.rawAttributes[this.fieldMapping.urlId].field,
      date: this.model.rawAttributes[this.fieldMapping.date].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

 
    this.association = {
      user: "user",   
      url: "url",    
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
      dateGreaterThan: (val) => {
        return {
          [`${this.columnMapping.date}`]: {
            [Op.gt]: val,
          },
        };
      },
      // fromDate: (val) => {
      //   return {
      //     [`${this.columnMapping.date}`]: {
      //       [Op.lte]: val,
      //     },
      //   };
      // },
      // toDate: (val) => {
      //   return {
      //     [`${this.columnMapping.createdAt}`]: {
      //       [Op.gte]: val,
      //     },
      //   };
      // },

      fromDate: (val) => {
        // Parse the date from string to a Date object (ensuring it's a valid date)
        const parsedDate = new Date(val);
        if (isNaN(parsedDate)) {
          throw new Error('Invalid fromDate value');
        }
    
        return {
          [`${this.columnMapping.date}`]: {
            [Op.gte]: parsedDate,  // greater than or equal to the parsed date
          },
        };
      },
    
      toDate: (val) => {
        // Parse the date from string to a Date object (ensuring it's a valid date)
        const parsedDate = new Date(val);
        if (isNaN(parsedDate)) {
          throw new Error('Invalid toDate value');
        }
    
        // We set the time to 23:59:59.999 to ensure the entire day is included
        parsedDate.setHours(23, 59, 59, 999);
    
        return {
          [`${this.columnMapping.createdAt}`]: {
            [Op.lte]: parsedDate,  // less than or equal to the parsed date
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

const urlClickConfig = new UrlClickConfig();
module.exports = urlClickConfig;
