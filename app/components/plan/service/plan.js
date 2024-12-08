const { transaction, rollBack, commit } = require("../../../utils/transaction");
const { createUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const InvalidError = require("../../../errors/invalidError");
const planConfig = require("../../../model-config/plan-config");
const { Op } = require("sequelize");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request.js");
const sendEmail = require('../../../utils/email.js');

class PlanService {
  async createPlan(id, name, description, type, amount, urlLimit, customUrlLimit, clicksPerUrl, numberOfUrlsRenewed, totalClicksPerUrl, t) {
    if (!t) {
      t = await transaction();
    }
  
    try {
      Logger.info("create plan service started");
  
       
      const existingPlan = await planConfig.model.findOne({
        where: { name },
        transaction: t,
      });
  
      if (existingPlan) {
        throw new InvalidError(`Plan with name ${name} already exists.`);
      }
  
       
      let planData = {
        id,
        name,
        description,
        type,
        amount,
      };
  
      if (type === 'clicks') {
       
        planData = {
          ...planData,
          totalClicksPerUrl,   
          numberOfUrlsRenewed, 
          urlLimit: null,     
          customUrlLimit: null,  
          clicksPerUrl: null,   
        };
      } else if (type === 'url') {
         
        planData = {
          ...planData,
          totalClicksPerUrl: null,  
          numberOfUrlsRenewed: null,  
          urlLimit,             
          customUrlLimit,      
          clicksPerUrl,         
        };
      } else {
         
        throw new InvalidError("Invalid plan type. It should be either 'url' or 'clicks'.");
      }
  
       
      console.log("Plan Data before creation:", planData);
  
       
      const plan = await planConfig.model.create(planData, { transaction: t });
  
      
      await commit(t);
      Logger.info("create plan service completed");
  
      return plan;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
  

  async updatePlan(id, updates, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("update plan service started");

      const plan = await planConfig.model.findByPk(id, { transaction: t });
      
      
      if (!plan) {
        throw new NotFoundError(`Plan with ID ${id} does not exist.`);
      }

      
      

       
      for (const { parameter, value } of updates) {
        
        if (!planConfig.fieldMapping[parameter]) {
          throw new InvalidError(`Invalid field: ${parameter}`);
        }
  
     
        plan[parameter] = value;
      }
    
    
      await plan.save({ transaction: t });
      await commit(t);

      Logger.info("update plan service completed");
      return plan;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async deletePlan(id, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("delete plan service started");

      const plan = await planConfig.model.findByPk(id, { transaction: t });

      if (!plan) {
        throw new NotFoundError(`Plan with ID ${id} does not exist.`);
      }

      const isDeleted = await planConfig.model.destroy({
        where: { id },
        transaction: t,
      });

      if (isDeleted === 0) {
        throw new NotFoundError(`Could not delete plan with ID ${id}`);
      }

      await commit(t);
      Logger.info("delete plan service completed");

      return isDeleted;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getAllPlans(queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("getAll plans service started");

      
      let selectArray = parseSelectFields(queryParams, planConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(planConfig.fieldMapping);  
      }

       
      const pagination = parseLimitAndOffset(queryParams);
      

       
      const filterResults = parseFilterQueries(queryParams, planConfig.filters);
      const finalWhere = { ...filterResults.where };   

       
      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        order: [['createdAt', 'DESC']],  
        transaction: t,
      };

       
      const { count, rows } = await planConfig.model.findAndCountAll(queryArgs);

      await commit(t);
      Logger.info("getAll plans service completed");
       
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;   
    }
  }

  async getPlanById(planId, queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("getAll plans service started");

      
      let selectArray = parseSelectFields(queryParams, planConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(planConfig.fieldMapping);  
      }

       
      const pagination = parseLimitAndOffset(queryParams);
      

       
      const filterResults = parseFilterQueries(queryParams, planConfig.filters);
      const finalWhere = { ...filterResults.where, id:planId };   

       
      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        transaction: t,
      };

       
      const plan = await planConfig.model.findOne(queryArgs);

      await commit(t);
      Logger.info("getAll plans service completed");

      return plan;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;   
    }


  }

  async getPlanByName(name,t){
    if(!t){
        t = await transaction();
    }

    try{
        Logger.info("get plan by name service started");

        const user = await planConfig.model.findOne(
            {
                where : {name},
            },
            {transaction: t}
        );

        

        
        await commit(t);
        Logger.info("get user by username service completed");
       
        return user;
    }
    catch(error){
        await rollBack(t);
        Logger.error(error);
    }
}
}

module.exports = PlanService;
