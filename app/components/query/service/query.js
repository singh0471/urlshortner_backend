const { transaction, commit, rollBack } = require("../../../utils/transaction");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const queryConfig = require("../../../model-config/query-config");
const userConfig = require("../../../model-config/user-config.js");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const InvalidError = require("../../../errors/invalidError");
const { Op } = require("sequelize");
const sendEmail = require('../../../utils/email.js');

class QueryService {

   
  async addQuery(id,userId, queryText, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Adding query from user");

      const user = await userConfig.model.findByPk(userId,{transaction:t});

       
      const newQuery = await queryConfig.model.create({
        id:id,
        userId:userId,
        username:user.username,
        query: queryText,
        status: "submitted",
      }, { transaction: t });

      
      await sendEmail(user.email, "Query added successfully", `Hi ${user.firstName}! Your query has been added successfully.`);

      await commit(t);
      
      Logger.info("Query added successfully");
      return newQuery;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

   
  async getAllQueries(queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Fetching all queries service started");

    
      let selectArray = parseSelectFields(queryParams, queryConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(queryConfig.fieldMapping);  
      }

      
      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, queryConfig.filters);
      const finalWhere = { ...filterResults.where, status: {[Op.or]: ["submitted", "pending"]} };  

      
      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        order: [['createdAt', 'ASC']],  
        transaction: t,
      };

     
      const { count, rows } = await queryConfig.model.findAndCountAll(queryArgs);

       
      for (const query of rows) {
        if (query.status === "submitted") {
          query.status = "pending";
          await query.save({ transaction: t }); 
        }
      }

      
      await commit(t);

      Logger.info("Fetched and updated queries successfully");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error fetching all queries: ${error.message}`);
      throw error;
    }
  }

  async responseToQuery(queryId, userId,adminResponse, t) {
    if (!t) {
        t = await transaction();
    }

    try {
        Logger.info("Admin responding to query started");
                                                         

        const query = await queryConfig.model.findByPk(queryId, { transaction: t });

        if (!query) {
            throw new NotFoundError("Query not found");
        }

       
        if (query.status === "responded") {
            throw new InvalidError("This query has already been responded.");
        }

        
        query.adminResponse = adminResponse;

         
        query.status = "responded";   
        
         
        await query.save({ transaction: t });



        const user = await userConfig.model.findByPk(userId,{transaction:t});
        await sendEmail(user.email, "Respond to your query", `Hi ${user.firstName}! Your query has got a respond..`);

        
        await commit(t);

        Logger.info(`Admin responded to query with ID: ${queryId}`);
        return query;
    } catch (error) {
         
        await rollBack(t);
        Logger.error(`Error responding to query: ${error.message}`);
        throw error;
    }
}


async getMyQueries(userId, queryParams, t) {
  if (!t) {
    t = await transaction();
  }

  try {
    Logger.info("Fetching all queries service started");

    let selectArray = parseSelectFields(queryParams, queryConfig.fieldMapping);
    if (!selectArray) {
      selectArray = Object.values(queryConfig.fieldMapping);  
    }

    const pagination = parseLimitAndOffset(queryParams);

    console.log(queryConfig);
    console.log(queryParams);

    const filterResults = parseFilterQueries(queryParams, queryConfig.filters);
    const finalWhere = { ...filterResults.where, userId: userId };  

    const queryArgs = {
      attributes: selectArray,
      ...pagination,
      where: finalWhere,
      order: [['createdAt', 'DESC']],  
      transaction: t,
    };

    const { count, rows } = await queryConfig.model.findAndCountAll(queryArgs);

    await commit(t);

    Logger.info("Queries fetched successfully");
    return { count, rows };
  } catch (error) {
    await rollBack(t);
    Logger.error(`Error fetching all queries: ${error.message}`);
    throw error;
  }
}






// async getMyQueries(userId,queryParams, t) {
//     if (!t) {
//       t = await transaction();
//     }

//     try {
//       Logger.info("Fetching all queries service started");

    
//       let selectArray = parseSelectFields(queryParams, queryConfig.fieldMapping);
//       if (!selectArray) {
//         selectArray = Object.values(queryConfig.fieldMapping);  
//       }

      
//       const pagination = parseLimitAndOffset(queryParams);

//       console.log(queryConfig);
//       console.log(queryParams)
      
//       const filterResults = parseFilterQueries(queryParams, queryConfig.fieldMapping);
//       const finalWhere = { ...filterResults.where, userId:userId};  

      
//       const queryArgs = {
//         attributes: selectArray,
//         ...pagination,
//         where: finalWhere,
//         transaction: t,
//       };

     
//       const { count, rows } = await queryConfig.model.findAndCountAll(queryArgs);

       
      
      
//       await commit(t);

//       Logger.info("queries fetched successfully");
//       return { count, rows };
//     } catch (error) {
//       await rollBack(t);
//       Logger.error(`Error fetching all queries: ${error.message}`);
//       throw error;
//     }
//   }
}

module.exports = QueryService;
