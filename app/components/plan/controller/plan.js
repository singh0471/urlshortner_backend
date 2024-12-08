const PlanService = require("../service/plan");
const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const InvalidError = require("../../../errors/invalidError");
const NotFoundError = require("../../../errors/notFoundError");
const {setXTotalCountHeader} = require("../../../utils/response");
class PlanController {
  constructor() {
    this.planService = new PlanService();
  }

  async createPlan(req, res, next) {
    try {
      Logger.info("create plan controller started");
  
      const { name, description, type, amount, urlLimit, customUrlLimit, clicksPerUrl, totalClicksPerUrl, numberOfUrlsRenewed } = req.body;
  
      // Validate the required fields
      if (!name || typeof name !== "string") throw new InvalidError("Invalid plan name");
      if (!description || typeof description !== "string") throw new InvalidError("Invalid description");
      if (!type || !["url", "clicks"].includes(type)) throw new InvalidError("Invalid type");
  
      // Call the service method to create the plan
      const response = await this.planService.createPlan(
        createUUID(), name, description, type, amount, urlLimit, customUrlLimit, clicksPerUrl, numberOfUrlsRenewed, totalClicksPerUrl
      );
  
      Logger.info("create plan controller completed");
  
      // Respond with the created plan data
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);  // Pass errors to the global error handler
    }
  }
  

  async updatePlan(req, res, next) {
    try {
      Logger.info("update plan controller started");

      const { planId } = req.params;
      const updates = req.body;

      if (!validateUUID(planId)) {
        throw new InvalidError("Invalid plan ID");
      }

      const response = await this.planService.updatePlan(planId, updates);
      Logger.info("update plan controller completed");

      res.status(HttpStatusCode.Ok).json({
        message: `Plan with ID ${planId} has been updated successfully`,
        plan: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req, res, next) {
    try {
      Logger.info("delete plan controller started");

      const { planId } = req.params;

      if (!validateUUID(planId)) {
        throw new InvalidError("Invalid plan ID");
      }

      const response = await this.planService.deletePlan(planId);
      Logger.info("delete plan controller completed");

      res.status(HttpStatusCode.Ok).json({
        message: `Plan with ID ${planId} has been deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPlans(req, res, next) {
    try {
      Logger.info("getAll plans controller started");

       
      const { count, rows } = await this.planService.getAllPlans(req.query);

       
      setXTotalCountHeader(res, count);

       
      res.status(HttpStatusCode.Ok).json(rows);

      Logger.info("getAll plans controller completed");
    } catch (error) {
      next(error);   
    }
  }

  async getPlanById(req, res, next) {
    try {
      Logger.info("getAll plans controller started");

      const {planId} = req.params; 

      if (!validateUUID(planId)) {
        throw new InvalidError("Invalid user ID.");
    } 
      const  plan = await this.planService.getPlanById(planId,req.query);

      res.status(HttpStatusCode.Ok).json(plan);

      Logger.info("get plan by id controller completed");
    } catch (error) {
      next(error);   
    }
  }
}

const planController = new PlanController();
module.exports = planController;
