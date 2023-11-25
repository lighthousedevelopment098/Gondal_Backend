const CustomAPIError = require("../errors/customError");
const BadRequestError = require("../errors/badRequestError");
const UnAuthenticatedError = require("../errors/unauthenticatedError");
const UnAuthrorizedError = require("../errors/unauthorizedError");
const NotFoundError = require("../errors/notFoundError");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnAuthenticatedError,
  UnAuthrorizedError,
  NotFoundError,
};
