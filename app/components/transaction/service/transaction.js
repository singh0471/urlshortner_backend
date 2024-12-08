const { transaction, commit, rollBack } = require("../../../utils/transaction");
const transactionConfig = require("../../../model-config/transaction-config");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const { Op } = require("sequelize");
const sendEmail = require('../../../utils/email.js');
const userConfig = require("../../../model-config/user-config.js");

class TransactionService {

 
  async createTransaction(id, userId,username,planId,planName, amount,  t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Creating a new transaction");

      const currentDate = new Date();
      const date = currentDate.toISOString().split('T')[0];
      const newTransaction = await transactionConfig.model.create(
        { id,planId, userId,username,planName, amount,date },
        { transaction: t }
      );

       

     
      Logger.info("Transaction created successfully");
      
     
      return newTransaction;
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error creating transaction: ${error.message}`);
      throw error;
    }
  }

 
  async getAllTransactions(queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Fetching all transactions service started");

      let selectArray = parseSelectFields(queryParams, transactionConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(transactionConfig.fieldMapping);   
      }

      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, transactionConfig.filters);
      const finalWhere = { ...filterResults.where };

      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        order: [['createdAt', 'DESC']],  
        transaction: t,
      };

      const { count, rows } = await transactionConfig.model.findAndCountAll(queryArgs);

      await commit(t);

      Logger.info("Fetched all transactions successfully");

      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error fetching all transactions: ${error.message}`);
      throw error;
    }
  }

 
  async getTransactionById(transactionId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info(`Fetching transaction by ID: ${transactionId}`);

      const transaction = await transactionConfig.model.findByPk(transactionId, { transaction: t });

      if (!transaction) {
        throw new NotFoundError("Transaction not found");
      }

      await commit(t);
      Logger.info(`Transaction fetched successfully with ID: ${transactionId}`);

      return transaction;
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error fetching transaction by ID: ${error.message}`);
      throw error;
    }
  }


  async getRevenueByUser(userId, t) {
    if (!t) {
      t = await transaction();
    }
  
    try {
      Logger.info(`Fetching revenue by user`);
  
     
      const { rows: transactions } = await transactionConfig.model.findAndCountAll({
        where: { userId },  
        transaction: t,
      });
  
      if (!transactions || transactions.length === 0) {
        return 0;
      }
  
      
      const totalRevenue = transactions
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)   
        .toFixed(2);   
  
      await commit(t);
      Logger.info(`Revenue by user successful.`);
  
      
      return { totalRevenue: parseFloat(totalRevenue) };
  
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error fetching revenue by user: ${error.message}`);
      throw error;
    }
  }
  

  async getMyAllTransactions(userId,queryParams, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Fetching all transactions service started");

      let selectArray = parseSelectFields(queryParams, transactionConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(transactionConfig.fieldMapping);   
      }

      const pagination = parseLimitAndOffset(queryParams);
      const filterResults = parseFilterQueries(queryParams, transactionConfig.fieldMapping);
      const finalWhere = { ...filterResults.where,userId:userId };

      const queryArgs = {
        attributes: selectArray,
        ...pagination,
        where: finalWhere,
        transaction: t,
      };

      const { count, rows } = await transactionConfig.model.findAndCountAll(queryArgs);

      await commit(t);

      Logger.info("Fetched all transactions successfully");

      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(`Error fetching all transactions: ${error.message}`);
      throw error;
    }
  }
}

module.exports = TransactionService;