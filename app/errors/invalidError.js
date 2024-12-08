const ShrinkItError = require("./shrinkItError");
const { StatusCodes } = require("http-status-codes");

class InvalidError extends ShrinkItError {
  constructor(specificMessage) {
     
    super(StatusCodes.BAD_REQUEST, specificMessage, "Invalid Error", "Invalid Request");
  }
}

module.exports = InvalidError;
