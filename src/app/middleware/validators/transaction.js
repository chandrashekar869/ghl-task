// All the validations for wallet api parameters to be declared here

const Joi = require('@hapi/joi');

const transactValidator = Joi.object({
  description: Joi
    .string()
    .trim()
    .max(256)
    .lowercase()
    .optional(),
  walletId: Joi
    .string()
    .trim()
    .required()
    .max(25)
    .lowercase(),
  amount: Joi
    .number()
    .required()
    .min(Number(process.env.MIN_TRANSACTION_AMOUNT))
    .not(0)
    .max(Number(process.env.MAX_TRANSACTION_AMOUNT)),
});

const listValidator = Joi.object({
  walletId: Joi
    .string()
    .trim()
    .required()
    .max(25)
    .lowercase(),
  skip: Joi
    .number()
    .optional()
    .min(0),
  limit: Joi
    .number()
    .optional()
    .min(1),
  sortColumn: Joi
    .string()
    .optional(),
  sortOrder: Joi
    .number()
    .optional()
    .equal(...[-1, 1]),
});

module.exports = {
  transactValidator: async (req, res, next) => {
    try {
      await transactValidator.validateAsync({ walletId: req.params.walletId, ...req.body });
      req.body = { walletId: req.params.walletId, ...req.body };
      req.body.amount = parseFloat(Number(req.body.amount || 0).toFixed(4));
      next();
    } catch (error) {
      next(error);
    }
  },
  listTransactValidator: async (req, res, next) => {
    try {
      await listValidator.validateAsync(req.query);
      req.query.skip = Number(req.query.skip);
      req.query.limit = Number(req.query.limit);
      next();
    } catch (error) {
      next(error);
    }
  },
};
