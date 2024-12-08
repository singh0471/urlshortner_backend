const BlacklistService = require("../service/blacklist");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { setXTotalCountHeader } = require("../../../utils/response");
const { HttpStatusCode } = require("axios");
const { createUUID,validateUUID } = require("../../../utils/uuid");
class BlacklistController {

    constructor(){
        this.blacklistService = new BlacklistService();
    }
  
  
  async addToBlacklist(req, res) {
   
    
    try {

      Logger.info("add to blacklist controller started");
        const { userId, reason } = req.body;

        if(!userId){
            throw new NotFoundError("user id not found.");
        }

        if(!reason){
            throw new NotFoundError("reason not found.");
        }

       console.log("first")
      const blacklistedUser = await this.blacklistService.addToBlacklist(createUUID(),userId, reason);
      
      res.status(200).json(blacklistedUser);
    } catch (error) {
      Logger.error("Error adding user to blacklist: ", error);
      res.status(400).json({ message: error.message });
    }
  }

  
  async removeFromBlacklist(req, res) {
    
    
    try {
        const { userId } = req.params;
        if(!userId){
            throw new NotFoundError("user id not found");
        }
      const result = await this.blacklistService.removeFromBlacklist(userId);
      
      res.status(200).json(result);
    } catch (error) {
      Logger.error("Error removing user from blacklist: ", error);
      res.status(400).json({ message: error.message });
    }
  }

   
  async isBlacklisted(req, res) {
    
    
    try {

        const { userId } = req.body;
        if(!userId){
            throw new NotFoundError("user id not found");
        }
       
      const isBlacklisted = await this.blacklistService.isBlacklisted(userId);
      
      res.status(200).json(isBlacklisted);
    } catch (error) {
      Logger.error("Error checking if user is blacklisted: ", error);
      res.status(400).json({ message: error.message });
    }
  }

  
  async getAllBlacklistedUsers(req, res) {
    

    try {
      const queryParams = req.query;
      const {count,rows} = await this.blacklistService.getAllBlacklistedUsers(queryParams);
      setXTotalCountHeader(res, count);
      res.status(200).json(rows);
    } catch (error) {
      Logger.error("Error fetching blacklisted users: ", error);
      res.status(400).json({ message: error.message });
    }
  }
}

const blacklistController = new BlacklistController();
module.exports = blacklistController;
