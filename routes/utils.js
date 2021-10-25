const csrf = require("csurf");
const { Op } = require("sequelize");

const db = require("../db/models");
const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

module.exports = {
  csrfProtection,
  asyncHandler,
};
