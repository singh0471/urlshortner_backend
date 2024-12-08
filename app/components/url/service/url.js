const { transaction, rollBack, commit } = require("../../../utils/transaction");
const { createUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const InvalidError = require("../../../errors/invalidError");
const urlConfig = require("../../../model-config/url-config");
const { Op, where } = require("sequelize");
const { generateRandomString } = require("../../../utils/shortUrlUtils.js");
const planConfig = require("../../../model-config/plan-config.js");
const userConfig = require("../../../model-config/user-config.js");
const usersPlansConfig = require("../../../model-config/usersplans-config.js");
const urlClicksConfig = require("../../../model-config/urlclicks-config.js");
const urlClickPlanAllocationConfig = require("../../../model-config/urlclickplanallocation-config.js");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request.js");
const sendEmail = require("../../../utils/email.js");


class UrlService {

   
  async createShortUrl(id, userId, userPlanId, actualUrl, isCustom, customUrl, t) {
    if (!t) {
      t = await transaction();
    }
  
    try {
      const userPlan = await usersPlansConfig.model.findOne({
        where: { id: userPlanId, userId },
        transaction: t,
      });

      console.log(userPlan);
  
      if (!userPlan) {
        throw new NotFoundError("You do not have this plan.");
      }
  
     
  
      
      if (isCustom) {
        const customCount = userPlan['customUrlLeft'];
        if (customCount === 0) {
          if (userPlan['totalCustomUrl'] > 0) {
            throw new InvalidError("You do not have custom URLs left in this plan");
          }
          throw new InvalidError("This plan does not include any custom URLs.");
        }
      }
  
      let shortUrl;
  
       
      if (!isCustom) {
        shortUrl = generateRandomString();
  
        let shortUrlExists = await urlConfig.model.findOne({ where: { shortUrl } });
        while (shortUrlExists) {
          shortUrl = generateRandomString();
          shortUrlExists = await urlConfig.model.findOne({ where: { shortUrl } });
        }
      } else {
        shortUrl = customUrl;
  
         
        const shortUrlExists = await urlConfig.model.findOne({ where: { shortUrl } });
        if (shortUrlExists) {
          throw new InvalidError("The custom URL already exists.");
        }
      }

      console.log(userPlan);

      const user = await userConfig.model.findByPk(userId,{transaction:t});
      const username = user.username;
      
      const newUrl = await urlConfig.model.create({
        id,
        userId,
        username,
        actualUrl,
        shortUrl,
        clicksLeft: userPlan['totalClicksPerUrl'],  
        isCustom,
      }, { transaction: t });
  
      
      userPlan['urlLeft'] -= 1;
  
      if (isCustom) {
        userPlan['customUrlLeft'] -= 1;
      }
  
      
      const isPlanOver = userPlan['urlLeft'] === 0;
      await userPlan.save({ transaction: t });
  
       
      if (isPlanOver) {
        await usersPlansConfig.model.destroy({
          where: { id: userPlanId },
          transaction: t,
        });
      }
  
       
      await commit(t);
  
      Logger.info(`Short URL created successfully: ${shortUrl}`);
  
      return newUrl;
  
    } catch (error) {
       
      await rollBack(t);
      Logger.error(`Error creating short URL: ${error.message}`);
      throw error;
    }
  }
  

   
  async getFullUrl(shortUrl, t) {
    if (!t) {
        t = await transaction();
    }

    try {
         
        const url = await urlConfig.model.findOne({ where: { shortUrl }, transaction: t });

        if (!url) {
            throw new NotFoundError('Short URL not found.');
        }

         
        const clickLeftForUrl = url.clicksLeft;

        if (clickLeftForUrl === 0) {
            throw new InvalidError("This URL has expired. Buy clicks to renew it.");
        }

        
        await urlClicksConfig.model.create({
            id: createUUID(),
            userId: url.userId,   
            urlId: url.id          
        }, { transaction: t });

         
        url.clicksLeft -= 1;
        url.totalClicks += 1;
        const actualUrl = url.actualUrl;   
        const clickLeft = url.clicksLeft;
        const userId = url.userId;
        await url.save({ transaction: t });
        
        const user = await userConfig.model.findByPk(userId,{transaction:t});

         
        await commit(t);

        if(clickLeft===0){
          await sendEmail(user.email, "URL Expired", `Hi ${user.firstName}! Your url - ${shortUrl} has been expired. renew now.`);
        }

         
        return actualUrl;
    } catch (error) {
         
        await rollBack(t);
        Logger.error(`Error fetching full URL for short URL ${shortUrl}: ${error.message}`);
        throw error;
    }
}

  
  

  
  async getUsersAllUrl(userId, queryParams, t) {
    if (!t) {
      t = await transaction();
    }
  
    try {
      Logger.info("get user's all URLs service started");
  
      
      const user = await userConfig.model.findByPk(userId, { transaction: t });
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found.`);
      }
  
       
      let selectArray = parseSelectFields(queryParams, urlConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(urlConfig.fieldMapping); 
      }
  
      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, urlConfig.filters);
  
       
      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: { ...filterResults.where, userId },  
        order: [['createdAt', 'DESC']],  
        transaction: t,
      };
  
       
      const { count, rows } = await urlConfig.model.findAndCountAll(queryArgs);
  
      await commit(t);
      Logger.info("get user's all URLs service completed");
  
      return { count, rows };  
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error in fetching URLs for user ID ${userId}: ${error.message}`);
      throw error;
    }
  }



  
  
  async renewUrls(shortUrls, id, userId, t) {
    if (!t) {
      t = await transaction();  
    }
  
    try {
      Logger.info("Renewing URLs for user");
  
      const userExist = await userConfig.model.findByPk(userId, { transaction: t });
      if (!userExist) {
        throw new NotFoundError(`User with ${userId} does not exist.`);
      }
  
      const userPlan = await usersPlansConfig.model.findOne({
        where: { id, userId },
        transaction: t,
      });
      if (!userPlan) {
        throw new NotFoundError("Plan not found.");
      }
  
       
      // if (userPlan.urlRenewLeft === 0) {
      //   await userPlan.destroy({ transaction: t });
      //   await commit(t);   
      //   return { message: `Plan has expired.` };
      // }
  
      const totalClicksAvailable = userPlan.urlRenewLeft;
      const clicksPerRenewal = userPlan.clickPerUrlRenew;
      const renewalsRequested = shortUrls.length;
  
      if (renewalsRequested > totalClicksAvailable) {
        throw new InvalidError("You cannot renew this many URLs in this plan.");
      }
  
      let renewalsProcessed = 0;
  
      
      for (let i = 0; i < shortUrls.length; i++) {
        const shortUrl = shortUrls[i];
  
        const url = await urlConfig.model.findOne({
          where: { shortUrl },
          transaction: t,
        });
  
        if (!url) {
          throw new NotFoundError(`URL with short URL ${shortUrl} not found.`);
        }
  
         
        url.clicksLeft += clicksPerRenewal;
        await url.save({ transaction: t });
  
        
        await urlClickPlanAllocationConfig.model.create({
          id: createUUID(),
          userId: userId,
          urlId: url.id,
          userPlanId: id,
          clicksAllocated: clicksPerRenewal,
          date: new Date().toISOString().split('T')[0],
        }, { transaction: t });
  
        renewalsProcessed++;
      }
  
      
      userPlan.urlRenewLeft -= renewalsProcessed;
      await userPlan.save({ transaction: t });
  
      const user = await userConfig.model.findByPk(userId, { transaction: t });
      const email = user.email;
      const firstName = user.firstName;

      if (userPlan.urlRenewLeft === 0) {
        await userPlan.destroy({ transaction: t });
        await commit(t);   
        return { message: `Plan has expired.` };
      }
  
      await commit(t);   
  
      Logger.info(`Successfully renewed ${renewalsProcessed} URLs for user ${userId}`);
  
       
      await sendEmail(email, "URL Renewed", `Hi ${firstName}! Your URL has been renewed successfully.`);
  
      return { message: `${renewalsProcessed} URLs renewed successfully!` };
    } catch (error) {
      await rollBack(t);   
      Logger.error(`Error renewing URLs: ${error.message}`);
      throw error;
    }
  }


  
  async getAllUrl(queryParams, t) {
    if (!t) {
      t = await transaction();
    }
  
    try {
      Logger.info("get user's all URLs service started");
  
      
    
  
       
      let selectArray = parseSelectFields(queryParams, urlConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(urlConfig.fieldMapping); 
      }
  
      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, urlConfig.filters);
  
       
      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: { ...filterResults.where },  
        order: [['createdAt', 'DESC']],  
        transaction: t,
      };
  
       
      const { count, rows } = await urlConfig.model.findAndCountAll(queryArgs);
  
      await commit(t);
      Logger.info("get user's all URLs service completed");
  
      return { count, rows };  
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error in fetching URLs }: ${error.message}`);
      throw error;
    }
  }

  

}

module.exports = UrlService;

