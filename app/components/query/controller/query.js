const QueryService = require("../service/query");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const InvalidError = require("../../../errors/invalidError");
const NotFoundError = require("../../../errors/notFoundError");
const { setXTotalCountHeader } = require("../../../utils/response");
const { createUUID,validateUUID } = require("../../../utils/uuid");
class QueryController {
  constructor() {
    this.queryService = new QueryService();
  }

  
  async addQuery(req, res, next) {
    try {
      Logger.info("Adding query controller started");

      const { userId } = req.params;    
      const { queryText } = req.body;  

      if (!queryText) {
        throw new InvalidError("Query text is required.");
      }

      if (!userId) {
        throw new NotFoundError("User ID is required.");
      }

      
      const newQuery = await this.queryService.addQuery(createUUID(),userId, queryText);

      Logger.info("Add query controller completed");

      res.status(HttpStatusCode.Created).json({
        message: "Query added successfully",
        query: newQuery,
      });
    } catch (error) {
      Logger.error(`Error adding query: ${error.message}`);
      next(error);
    }
  }

  
  async getAllQueries(req, res, next) {
    try {
      Logger.info("Fetching all queries controller started");

      const queryParams = req.query;    

      
      const { count, rows } = await this.queryService.getAllQueries(queryParams);

      setXTotalCountHeader(res, count);

      Logger.info("Fetching all queries controller completed");

      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      Logger.error(`Error fetching all queries: ${error.message}`);
      next(error);
    }
  }

 
  async responseToQuery(req, res, next) {
    try {
      Logger.info("Responding to query controller started");

      const { queryId } = req.params;        
      const { userId,adminResponse } = req.body;      

      if (!adminResponse) {
        throw new InvalidError("Admin response is required.");
      }

      if(!queryId || !validateUUID(queryId)){
        throw new InvalidError("invalid query id entered");
      }
      if(!userId || !validateUUID(userId)){
        throw new InvalidError("uinvalid user id");
      }

 
      const updatedQuery = await this.queryService.responseToQuery(queryId,userId, adminResponse);

      Logger.info("Responding to query controller completed");

      res.status(HttpStatusCode.Ok).json({
        message: "Query responded successfully",
        query: updatedQuery,
      });
    } catch (error) {
      Logger.error(`Error responding to query: ${error.message}`);
      next(error);
    }
  }

 
  async getMyQueries(req, res, next) {
    try {
      Logger.info("Fetching user's queries controller started");

      const { userId } = req.params;  
      const queryParams = req.query;  

      if (!userId) {
        throw new NotFoundError("User ID is required.");
      }

      
      const { count, rows } = await this.queryService.getMyQueries(userId, queryParams);

      setXTotalCountHeader(res, count);

      Logger.info("Fetching user's queries controller completed");

      res.status(HttpStatusCode.Ok).json(
        rows
      );
    } catch (error) {
      Logger.error(`Error fetching user's queries: ${error.message}`);
      next(error);
    }
  }
}

const queryController = new QueryController();
module.exports = queryController;
