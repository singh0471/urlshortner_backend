class ShrinkItError extends Error {
    constructor(httpStatusCode, specificMessage, type, message) {
      super(message);   
      this.httpStatusCode = httpStatusCode;
      this.type = type;
      this.specificMessage = specificMessage 
    }
  }
  
  module.exports = ShrinkItError;
  