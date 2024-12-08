const ShrinkItError = require("./shrinkItError");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends ShrinkItError {
  constructor(specificMessage) {
  
    super(StatusCodes.NOT_FOUND, specificMessage, "Not Found Error", "Not Found Request");
  }
}

module.exports = NotFoundError;
