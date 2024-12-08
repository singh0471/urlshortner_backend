const ShrinkItError = require("./shrinkItError");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends ShrinkItError {
  constructor(specificMessage) {
    
    super(StatusCodes.UNAUTHORIZED, specificMessage, "Unauthorized Error", "Unauthorized Request");
  }
}

module.exports = UnauthorizedError;
