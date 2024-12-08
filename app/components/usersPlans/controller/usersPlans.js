const UserPlansService = require("../service/usersPlans");
const { HttpStatusCode } = require("axios");
const Logger = require("../../../utils/logger");
const InvalidError = require("../../../errors/invalidError");
const NotFoundError = require("../../../errors/notFoundError");
const { createUUID, validateUUID } = require("../../../utils/uuid");

class UserPlansController {
  constructor() {
    this.usersPlansService = new UserPlansService();
  }


  

  
  async buyPlan(req, res, next) {
    try {
      Logger.info("buy plan controller started");

       
      const { userId } = req.params;
      const { planIds } = req.body;

       
      if (!userId || !planIds) {
        throw new InvalidError("User ID and Plan ID are required.");
      }

       
      const userPlan = await this.usersPlansService.buyAllPlans(userId, planIds);

      Logger.info("buy plan controller completed");

      
      res.status(HttpStatusCode.Created).json(userPlan);
    } catch (error) {
      Logger.error(error);
      next(error);  
    }
  }

  async getPlansByUserId(req, res, next) {
    try {
      Logger.info("get plans by user ID controller started");

       
      const { userId } = req.params;
      const queryParams = req.query;  

      if (!userId) {
        throw new NotFoundError("User ID is required.");
      }

     
      const { count, rows } = await this.usersPlansService.getPlansByUserId(userId, queryParams);

      Logger.info("get user url's by user ID controller completed");

     
      res.set("X-Total-Count", count);  
      res.status(HttpStatusCode.Ok).json(rows);  

    } catch (error) {
      Logger.error(error);
      next(error);  
    }
  }
}

const userPlansController = new UserPlansController();
module.exports = userPlansController;
