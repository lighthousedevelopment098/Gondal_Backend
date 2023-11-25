const CustomAPIError = require("./customError");
const { StatusCodes } = require("http-status-codes");
class UnAuthrorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
module.exports = UnAuthrorizedError;
