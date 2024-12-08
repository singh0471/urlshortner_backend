const UrlClicksService = require("../service/urlClicks");
const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const InvalidError = require("../../../errors/invalidError");
const NotFoundError = require("../../../errors/notFoundError");
const {setXTotalCountHeader} = require("../../../utils/response");


class UrlClicks {
  constructor() {
    this.urlClicksService = new UrlClicksService();
  }


  async getAllUrlClicks(req, res, next) {
    try {
      Logger.info("getAll url clicks controller started");

      const {userId} = req.params;
      const {urlId} = req.body;

      if(!userId || !validateUUID(userId)){
        throw new InvalidError("invalid user id entered.")
      }

    //   if(!urlId || !validateUUID(urlId)){
    //     throw new InvalidError("invalid url id entered.")
    //   }

       
      const { count, rows } = await this.urlClicksService.getAllUrlClicks(userId,urlId,req.query);

       
      setXTotalCountHeader(res, count);

       
      res.status(HttpStatusCode.Ok).json(rows);

      Logger.info("getAll plans controller completed");
    } catch (error) {
      next(error);   
    }
  }

  
}

const urlClicksController = new UrlClicks();
module.exports = urlClicksController;




