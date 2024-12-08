const { transaction, commit, rollBack } = require("../../../utils/transaction");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const blacklistConfig = require("../../../model-config/blacklist-config");
const NotFoundError = require("../../../errors/notFoundError");
const InvalidError = require("../../../errors/invalidError");
const Logger = require("../../../utils/logger");
const userConfig = require("../../../model-config/user-config");
const sendEmail = require('../../../utils/email.js');
class BlacklistService {

   
    async addToBlacklist(id, userId, reason, t) {
        if (!t) {
          t = await transaction();
        }
      
        try {

          console.log("add to blacklist service started")
           
          const existingBlacklist = await blacklistConfig.model.findOne({ where: { userId }, transaction: t });
      
          if (existingBlacklist) {
            throw new InvalidError("User has already been blacklisted.");
          }
      
           
          const user = await userConfig.model.findByPk(userId, { transaction: t });
      
          if (!user) {
            throw new NotFoundError("User does not exist.");
          }
      
           
          const newBlacklist = await blacklistConfig.model.create({
            id,
            userId,
            reason
          }, { transaction: t });
      
           
          await user.update({ status: 'blacklisted' }, { transaction: t });
      
          
          
      
          Logger.info(`User ${userId} has been blacklisted`);
      
           
          await sendEmail(user.email, "Account Blacklisted", `Hi ${user.firstName}! Your ShrinkIt account has been blacklisted. The reason is: ${reason}. Please contact shrinkit4@gmail.com for more information.`);
          await commit(t);
          return newBlacklist;
        } catch (error) {
           
          await rollBack(t);
          Logger.error(`Error adding user ${userId} to blacklist: ${error.message}`);
          throw error;
        }
      }
      

  
  async removeFromBlacklist(userId, t) {
    if (!t) {
      t = await transaction();
    }

    try {


        const user = await userConfig.model.findByPk(userId,{transaction:t});

        if(!user){
          throw new NotFoundError("user does not exists");
        }
        
        
      const existingUser = await blacklistConfig.model.findOne({ where: { userId:userId }, transaction: t });

      if (!existingUser) {
        throw new NotFoundError("user not found in blacklist.");
      }

      await user.update({ status: 'active' }, { transaction: t });
      await existingUser.destroy({ transaction: t });

     
      
      await commit(t);
      await sendEmail(user.email, "Account Activated", `Hi ${user.firstName}! Your ShrinkIt account has been Activated again.`);
      Logger.info(`user removed from blacklist: ${userId}`);
      return { message: "User successfully removed from blacklist." };
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error removing user from blacklist: ${error.message}`);
      throw error;
    }
  }

 
  async isBlacklisted(userId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      const blacklistedUser = await blacklistConfig.model.findOne({ where: { userId:userId }, transaction: t });

      await commit(t);

      return blacklistedUser ? true : false;
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error checking if user is blacklisted: ${error.message}`);
      throw error;
    }
  }
 
  async getAllBlacklistedUsers(queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Fetching all blacklisted users service started");

       
      let selectArray = parseSelectFields(queryParams, blacklistConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(blacklistConfig.fieldMapping);   
      }

      

       
      const pagination = parseLimitAndOffset(queryParams);

       
      const filterResults = parseFilterQueries(queryParams, blacklistConfig.filters);   
      const finalWhere = { ...filterResults.where };

       
      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        transaction: t,
         
      };

       
      const { count, rows } = await blacklistConfig.model.findAndCountAll(queryArgs);

      await commit(t);

      Logger.info("Fetching all blacklisted users service completed");

      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error("Error fetching blacklisted users: ", error);
      throw error;
    }
  }
}

module.exports = BlacklistService;
