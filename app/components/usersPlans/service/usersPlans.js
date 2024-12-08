const { Op, where } = require("sequelize");
const userConfig = require("../../../model-config/user-config");
const planConfig = require("../../../model-config/plan-config");
const usersPlansConfig = require('../../../model-config/usersplans-config')
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const InvalidError = require("../../../errors/invalidError");
const { transaction, commit, rollBack } = require("../../../utils/transaction");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request.js");
const TransactionService = require("../../transaction/service/transaction.js");
const sendEmail = require('../../../utils/email.js');
class UserPlansService {

  constructor(){
    this.transactionService = new TransactionService();
  }
  
  async getPlanByName(planName, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get plan by name service started");

      const plan = await planConfig.model.findOne({
        where: { name: planName },
        transaction: t
      });

      if (!plan) {
        throw new NotFoundError(`Plan with name ${planName} not found.`);
      }

      await commit(t);
      Logger.info("get plan by name service completed");

      return plan;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }


  async buyAllPlans(userId, planIds,t){
    if(!t){
      t = await transaction();
    }

    try{

    for(let planId of planIds){
      await this.buyPlan(createUUID(),userId,planId,t);
    }

    const user = await userConfig.model.findByPk(userId);
    const email = user.email;
    const firstName = user.firstName;
    await commit(t);
    
    await sendEmail(email, "Plan Purchased", `Hi ${firstName}! Your puchase has been successful.`);
    Logger.info("buy all plan service completed");
    return "all plan has been purchased successfully";
  }
  catch(error){
    await rollBack(t);
    Logger.error(error);
    throw error;
  }
  }

   
  async buyPlan(id,userId, planId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("buy plan service started");

       
      const user = await userConfig.model.findByPk(userId, { transaction: t });
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found.`);
      }

      const username = user.username;

       
      const plan = await planConfig.model.findByPk(planId, {transaction:t});

      if(!plan){
        throw NotFoundError("the plan does not exists");
      }

      const amount = plan.amount;
      const planName = plan.name;

      
       

     
     
      const freePlan = await usersPlansConfig.model.findOne(
        {
            where : {userId:userId,planName:'free'},
        },
        {transaction: t}
      )

       

      if(freePlan && plan.name==='free'){
        throw new InvalidError("free plan has already been purchased");
      }

    

     
      
      const planBought = await usersPlansConfig.model.create({
        id:id,
        userId:userId,
        planId:planId,
        planName:plan.name,
        planType:plan.type,
        totalUrl: plan.urlLimit,
        totalCustomUrl: plan.customUrlLimit,
        totalClicksPerUrl:plan.clicksPerUrl,
        urlLeft : plan.urlLimit,
        customUrlLeft : plan.customUrlLimit,
        urlRenewLimit : plan.numberOfUrlsRenewed,
        urlRenewLeft: plan.numberOfUrlsRenewed,
        clickPerUrlRenew : plan.totalClicksPerUrl,
        amount : amount,
        planType : plan.type,


      },{transaction:t})

      console.log(parseFloat((user.totalRevenue + amount).toFixed(2)));
      user.totalRevenue =  parseFloat((user.totalRevenue + amount).toFixed(2));
      user.save({ transaction: t })

      if(plan.name!=='free'){
      await this.transactionService.createTransaction(createUUID(),userId,username,planId,planName,amount,t);
      }
      
      Logger.info("buy plan service completed");

      return planBought;
    } catch (error) {
       
      Logger.error(error);
      throw error;
    }
  }


  async getPlansByUserId(userId, queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get plans by user ID service started");

      
      const user = await userConfig.model.findByPk(userId, { transaction: t });
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found.`);
      }
 
      let selectArray = parseSelectFields(queryParams, usersPlansConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(usersPlansConfig.fieldMapping); 
      }

      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, usersPlansConfig.filters);
      const finalWhere = { ...filterResults.where, userId };  

      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        order: [['createdAt', 'DESC']],  
        transaction: t,
      };

       
      const { count, rows } = await usersPlansConfig.model.findAndCountAll(queryArgs);

      if (!rows || rows.length === 0) {
        throw new NotFoundError("No plans found for this user.");
      }

      await commit(t);
      Logger.info("get plans by user ID service completed");

      return { count, rows };  
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }



}

module.exports = UserPlansService;
