// All the validations for wallet api parameters to be declared here

const Joi = require('@hapi/joi');

const setupValidator = Joi.object({
  walletName: Joi
    .string()
    .trim()
    .required()
    .lowercase(),
  walletBalance: Joi
    .number()
    .optional()
    .min(Number(process.env.MIN_WALLET_BALANCE))
    .max(Number(process.env.MAX_WALLET_BALANCE)),
});

const listWalletValidator = Joi.object({
  walletId: Joi
    .string()
    .trim()
    .required()
    .max(25)
    .lowercase(),
});

module.exports = {
  setupValidator: async (req, res, next) => {
    try {
      console.log(req.body);
      await setupValidator.validateAsync(req.body);
      req.body.walletBalance = parseFloat(Number(req.body.walletBalance || 0).toFixed(4));
      next();
    } catch (error) {
      next(error);
    }
  },
  listWalletValidator: async (req, res, next) => {
    try {
      await listWalletValidator.validateAsync(req.params);
      return next();
    } catch (error) {
      return next(error);
    }
  },
};
