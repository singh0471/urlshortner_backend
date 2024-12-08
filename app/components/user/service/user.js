const bcrypt = require("bcrypt");
const { transaction, rollBack, commit } = require("../../../utils/transaction");
const { createUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const InvalidError = require("../../../errors/invalidError");
const userConfig = require("../../../model-config/user-config");
const { Op } = require("sequelize");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request.js");
const sendEmail = require('../../../utils/email.js');
const urlConfig = require("../../../model-config/url-config.js");
const usersPlansConfig = require("../../../model-config/usersplans-config.js");
const UsersPlansService =  require("../../usersPlans/service/usersPlans");
const PlanService = require("../../plan/service/plan.js");

class UserService {


  


  #associationMap = {
    urls : {
        model : urlConfig.model,
        required : false
    },
    usersPlans : {
      model : usersPlansConfig.model,
      required : false
  }
};

#createAssociations(includeQuery){
    const associations = [];

    if(!Array.isArray(includeQuery)){
        includeQuery = [includeQuery];
    }

    if(includeQuery?.includes(userConfig.association.urls)){
        associations.push(this.#associationMap.urls);
    }

    if(includeQuery?.includes(userConfig.association.usersPlans)){
      associations.push(this.#associationMap.usersPlans);
  }
    
    return associations;
}

    async getUserByUsername(username,t){
        if(!t){
            t = await transaction();
        }

        try{

          
            Logger.info("get user by user name service started");

            const user = await userConfig.model.findOne(
                {
                    where : {username:username},
                },
                {transaction: t}
            );

            

            
            console.log(user);
            Logger.info("get user by username service completed");
            
            return user;
        }
        catch(error){
            await rollBack(t);
            Logger.error(error);
        }
    }  

  
  async createUser(id,username, firstName, lastName, email, password, isAdmin, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("create user service started");

      
      const hashedPassword = await bcrypt.hash(password,10);

      
      const userByUsername = await this.getUserByUsername(username);
       
      if(userByUsername){
        throw new InvalidError("username already exists");}

      console.log(userByUsername);


      const totalRevenue = 0.0;

       
      const user = await userConfig.model.create(
        {
          id,
          username,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          isAdmin,
          totalRevenue,
          status:'active'
        },
        { transaction: t }
      );

      
      const usersPlansService = new UsersPlansService();
      const planService = new PlanService();


      const freePlan = await planService.getPlanByName('free');
      console.log("free plan ",freePlan);
      console.log("is admin ",isAdmin);
      const freePlanId = freePlan.id;
      await commit(t);
      
      if(freePlan && !isAdmin){
        await usersPlansService.buyAllPlans(id,[freePlanId]);
      }

     
      await sendEmail(email,"Registration Successful",`Hi ${firstName}! your account has been successfully created on shrinkit, your username is - ${username} and your password is - ${password}`);
      Logger.info("create user service completed");

      return user;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  
  async updateUser(id, updates, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("update user service started");

      const user = await userConfig.model.findByPk(id, { transaction: t });
      if (!user) {
        throw new NotFoundError(`User with ID ${id} does not exist.`);
      }

       
      for (let { parameter, value } of updates) {
        if (!userConfig.fieldMapping[parameter]) {
          
          throw new InvalidError(`Invalid field: ${parameter}`);
        }


        if(parameter === 'username'){
            const userByUsername = await this.getUserByUsername(value,t);

            if(userByUsername){
                throw new InvalidError("username already exists");
            }
        }
         
        if (parameter === 'password') {
          value = await bcrypt.hash(value,10);
        }

        user[parameter] = value;
      }

      const email = user.email;
      const firstName = user.firstName;

      await user.save({ transaction: t });
      await commit(t);
      await sendEmail(email,"Account Updated",`Hi ${firstName}! Your credentials has been updated successfully.`);
      Logger.info("update user service completed");
      return user;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

 
  async deleteUser(id, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("delete user service started");

      const user = await userConfig.model.findByPk(id, { transaction: t });
      if (!user) {
        throw new NotFoundError(`User with ID ${id} does not exist.`);
      }
      const email = user.email;
      const firstName = user.firstName;
      await userConfig.model.destroy({ where: { id }, transaction: t });
      await commit(t);
      await sendEmail(email,"Account Deleted",`Hi ${firstName}! Your account has been deleted successfully.`);
      Logger.info("delete user service completed");

      return true;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

 
  async getAllUsers(queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get all users service started");

      let selectArray = parseSelectFields(queryParams, userConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(userConfig.fieldMapping);  
      }

      const includeQuery = queryParams.include || [];
            let association = [];
            
            if(includeQuery){
                association = this.#createAssociations(includeQuery);
            }

      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, userConfig.filters);
      const finalWhere = { ...filterResults.where, isAdmin:false };

      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        order: [['createdAt', 'DESC']],  
        transaction: t,
        include:association
      };

      const queryArgs2 = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        order: [['createdAt', 'DESC']],  
        transaction: t
      };

      const { count1, rows } = await userConfig.model.findAndCountAll(queryArgs);
      const { count, rows2 } = await userConfig.model.findAndCountAll(queryArgs2);

      console.log("count 1 " ,count1)
      console.log(rows)
      console.log("count ",count);

      await commit(t);
      Logger.info("get all users service completed");

      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }


  async getUserById(userId, queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get all users service started");

      let selectArray = parseSelectFields(queryParams, userConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(userConfig.fieldMapping);  
      }

      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, userConfig.filters);
      const finalWhere = { ...filterResults.where, isAdmin:false, id:userId };

      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        transaction: t,
      };

      const user = await userConfig.model.findOne(queryArgs);

      await commit(t);
      Logger.info("get all users service completed");

      return user;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = UserService;
