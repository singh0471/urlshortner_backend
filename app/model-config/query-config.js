const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
 

class QueryConfig {
  constructor() {
    
    this.fieldMapping = {
      id: "id",
      userId: "userId",
      username:"username",
      query: "query",
      adminResponse: "adminResponse",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

 
    this.model = db.query;  
    this.modelName = db.query.name; 
    this.tableName = db.query.options.tableName;  

    
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      username: this.model.rawAttributes[this.fieldMapping.username].field,
      query: this.model.rawAttributes[this.fieldMapping.query].field,
      adminResponse: this.model.rawAttributes[this.fieldMapping.adminResponse].field,
      status: this.model.rawAttributes[this.fieldMapping.status].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

   
    this.association = {
      user: "user",  
    };

 
    this.filters = {
      id: (val) => {
       
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
 
      query: (val) => {
        return {
          [`${this.columnMapping.query}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      status: (val) => {
        
        return {
          [`${this.columnMapping.status}`]: {
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

const queryConfig = new QueryConfig();
module.exports = queryConfig;
