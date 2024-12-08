const UrlService = require("../service/url");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const InvalidError = require("../../../errors/invalidError");
const { createUUID,validateUUID } = require("../../../utils/uuid");
const NotFoundError = require("../../../errors/notFoundError");
const { setXTotalCountHeader } = require("../../../utils/response");
const axios = require('axios');
class UrlController {
  constructor() {
    this.urlService = new UrlService();
  }



  async verifyUrlExists(url) {
    try {

      console.log("ngmgfmfgmgyhc ,hhd,c ghc  user")
      const response = await axios.head(url);   
      if (response.status !== 200) {
        throw new InvalidError(`The URL ${url} does not exist or is unreachable.`);
      }
    } catch (error) {
      throw new InvalidError(`The URL ${url} is not valid or unreachable. Error: ${error.message}`);
    }
  }

   
  async createShortUrl(req, res, next) {
    try {
      Logger.info("create short URL controller started");

      const { userId } = req.params;
      const { userPlanId,actualUrl, isCustom, customUrl } = req.body;

       
      if (!actualUrl ) {
        throw new InvalidError("Actual URL is required.");
      }
      
      await this.verifyUrlExists(actualUrl);

      if(!userId)
        throw new NotFoundError("user id is required");

      if(!userPlanId)
        throw new NotFoundError("plan id is required");

      if(isCustom){
        if(!customUrl){
            throw new InvalidError("custom url is required");
        }
      }

       
      const id = createUUID();

       
      const newUrl = await this.urlService.createShortUrl(id, userId, userPlanId, actualUrl, isCustom, customUrl);

      Logger.info("create short URL controller completed");

       
      res.status(HttpStatusCode.Created).json({
        message: "Short URL created successfully",
        shortUrl: newUrl.shortUrl,
        fullUrl: newUrl.actualUrl,
      });
    } catch (error) {
      Logger.error(error);
      next(error);  
    }
  }

 
  async getFullUrl(req, res, next) {
    try {
      Logger.info("get full URL controller started");

      const { shortUrl } = req.params;

      if (!shortUrl) {
        throw new InvalidError("Short URL is required.");
      }

       
      const fullUrl = await this.urlService.getFullUrl(shortUrl);

      Logger.info("get full URL controller completed");

       
      res.status(HttpStatusCode.Ok).json(fullUrl);
    } catch (error) {
      Logger.error(error);
      next(error); 
    }
  }

  async getUsersAllUrl(req, res, next) {
    try {
      Logger.info("get user's all URLs controller started");
  
      const { userId } = req.params;
      const queryParams = req.query; 
  
       
      if (!validateUUID(userId)) {
        throw new InvalidError("Invalid user ID.");
      }
  
      
      const { count, rows } = await this.urlService.getUsersAllUrl(userId, queryParams);
  
       
      setXTotalCountHeader(res, count);
  
      
      res.status(HttpStatusCode.Ok).json(rows);
  
      Logger.info("get user's all URLs controller completed");
    } catch (error) {
      Logger.error(`Error in get user's all URLs controller: ${error.message}`);
      next(error);  
    }
  }

  async redirectToLongUrl(req, res, next) {
    try {
      Logger.info("Redirect to long URL controller started");

      const { shortUrl } = req.params;   

       
      const longUrl = await this.urlService.getFullUrl(shortUrl);

       
       
      res.redirect(longUrl);   
 
      Logger.info("Redirected to long URL: " + longUrl);
    } catch (error) {
      Logger.error(`Error during redirect: ${error.message}`);
      next(error);  
    }
  }


  async renewUrls(req, res, next) {
    try {
      Logger.info("Renew URLs controller started");

      const { userId ,id} = req.params;  
      const { shortUrls } = req.body;  

      console.log(shortUrls);
      

       
      if (!Array.isArray(shortUrls) || shortUrls.length === 0) {
        throw new InvalidError("Please provide an array of short URLs.");
      }

      if (!id || !userId) {
        throw new InvalidError("Plan ID and User ID are required.");
      }

      
      const result = await this.urlService.renewUrls(shortUrls, id, userId);

      Logger.info("Renew URLs controller completed successfully");

      
      res.status(HttpStatusCode.Ok).json({
        message: result.message,
      });
    } catch (error) {
      Logger.error(`Error in Renew URLs controller: ${error.message}`);
      next(error); 
    }
  }


  async getAllUrls(req, res, next) {
    try {
      Logger.info("get all URLs controller started");
      
      const queryParams = req.query; 

      const { count, rows } = await this.urlService.getAllUrl(queryParams);
         
      setXTotalCountHeader(res, count);
  
      
      res.status(HttpStatusCode.Ok).json(rows);
  
      Logger.info("get all URLs controller completed");
    } catch (error) {
      Logger.error(`Error in get all URLs controller: ${error.message}`);
      next(error);  
    }
  }
  
}

const urlController = new UrlController();
module.exports = urlController;
