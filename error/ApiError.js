class ApiError {
    constructor(code, message) {
      this.code = code;
      this.message = message;
    }
  
    static badCredentials(msg) {
      return new ApiError(400, msg);
    }

    static badRequest(msg) {
        return new ApiError(400, msg);
      }
  
    static internal() {
      return new ApiError(500, 'Internal error, please try again at a later time');
    }
  }
  
  module.exports = ApiError;