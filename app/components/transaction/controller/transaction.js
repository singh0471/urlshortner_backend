const TransactionService = require("../service/transaction");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const InvalidError = require("../../../errors/invalidError");
const { setXTotalCountHeader } = require("../../../utils/response");
const { createUUID,validateUUID } = require("../../../utils/uuid");

class TransactionController {
  constructor() {
    this.transactionService = new TransactionService();
  }

  
  async createTransaction(req, res, next) {
    try {
      Logger.info("Create transaction controller started");

      const { userId } = req.params;
      const { amount,planId } = req.body;
      
     
      if (!userId) {
        throw new InvalidError("User ID is required.");
      }
      if (!amount) {
        throw new InvalidError("Amount is required.");
      }

      if(!planId  || !validateUUID()){
        throw new InvalidError("invalid plan id entered")
      }

        

      const newTransaction = await this.transactionService.createTransaction(createUUID(), userId,planId, amount);

      Logger.info("Create transaction controller completed");

      res.status(HttpStatusCode.Created).json({
        message: "Transaction created successfully",
        transaction: newTransaction,
      });
    } catch (error) {
      Logger.error(`Error in create transaction: ${error.message}`);
      next(error);  
    }
  }

 
  async getAllTransactions(req, res, next) {
    try {
      Logger.info("Get all transactions controller started");

      const queryParams = req.query;  
      
      const { count, rows } = await this.transactionService.getAllTransactions(queryParams);

      setXTotalCountHeader(res, count);   

      Logger.info("Get all transactions controller completed");

      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      Logger.error(`Error in get all transactions: ${error.message}`);
      next(error);   
    }
  }

   
  async getTransactionById(req, res, next) {
    try {
      Logger.info("Get transaction by ID controller started");

      const { transactionId } = req.params;

      if (!transactionId) {
        throw new InvalidError("Transaction ID is required.");
      }

      const transaction = await this.transactionService.getTransactionById(transactionId);

      Logger.info("Get transaction by ID controller completed");

      res.status(HttpStatusCode.Ok).json({
        message: "Transaction fetched successfully",
        transaction: transaction,
      });
    } catch (error) {
      Logger.error(`Error in get transaction by ID: ${error.message}`);
      next(error);   
    }
  }


  async getRevenueByUser(req, res, next) {
    try {
      Logger.info("Get revenue by user controller started");
  
      
      const { userId } = req.params;
  
      if (!userId) {
        throw new InvalidError("User ID is required.");
      }
  
     
      const revenueData = await this.transactionService.getRevenueByUser(userId);
  
      Logger.info("Get revenue by user controller completed");
  
       
      res.status(HttpStatusCode.Ok).json(revenueData);
    } catch (error) {
      Logger.error(`Error in get revenue by user: ${error.message}`);
      next(error);
    }
  }
  

  
  async getMyAllTransactions(req, res, next) {
    try {
      Logger.info("Get my transactions controller started");

      const { userId } = req.params;
      const queryParams = req.query; 

      if (!userId) {
        throw new InvalidError("User ID is required.");
      }

      const { count, rows } = await this.transactionService.getMyAllTransactions(userId, queryParams);

      setXTotalCountHeader(res, count);   

      Logger.info("Get my transactions controller completed");

      res.status(HttpStatusCode.Ok).json({
        message: "Your transactions fetched successfully",
        transactions: rows,
      });
    } catch (error) {
      Logger.error(`Error in get my transactions: ${error.message}`);
      next(error);  
    }
  }
}

const transactionController = new TransactionController();
module.exports = transactionController;
