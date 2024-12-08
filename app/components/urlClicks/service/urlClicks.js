const { transaction, rollBack, commit } = require("../../../utils/transaction");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const InvalidError = require("../../../errors/invalidError");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request.js");
const urlClickConfig = require("../../../model-config/urlclicks-config.js");

class UrlClicksService {
  
    async getAllUrlClicks(userId,urlId,queryParams, t) {
        if (!t) {
            t = await transaction();
    }

    try {
      Logger.info("getAll url clicks service started");

      
      let selectArray = parseSelectFields(queryParams, urlClickConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(urlClickConfig.fieldMapping);  
      }

       
      const pagination = parseLimitAndOffset(queryParams);
      

       
      const filterResults = parseFilterQueries(queryParams, urlClickConfig.filters);
      const finalWhere = { ...filterResults.where };   

       
      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,userId:userId,urlId:urlId,
        order: [['createdAt', 'DESC']],  
        transaction: t,
      };

       
      const { count, rows } = await urlClickConfig.model.findAndCountAll(queryArgs);

      await commit(t);
      Logger.info("getAll url clicks service completed");
       
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;   
    }
  }

 


  }

  


module.exports = UrlClicksService;
