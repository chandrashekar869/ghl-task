/* eslint-disable dot-notation */
const transactionConst = require('../../utils/constants/transaction.constants.json');
const { errorCodes } = require('../../utils/config/mongo.config');
const { logger } = require('../../utils/loggers/winston.logger');

const { createTransaction } = require('../helpers/transaction.helpers');
const { createWallet, getWallets } = require('../helpers/wallet.helpers');

exports.listWalletController = async (request, response, next) => {
  try {
    const result = await getWallets(request.params.walletId);
    if (result.length) {
      response.locals.processed = true;
      response.send(result[0]);
      return next();
    }
    return next({
      type: 400,
      message: 'Invalid wallet id',
    });
  } catch (error) {
    logger.error(`Error caught under setupController in wallet.controller.js ${error}`);
    return next(error);
  }
};

exports.listWalletsController = async (request, response, next) => {
  try {
    const result = await getWallets(request.params.walletId);
    if (result.length) {
      response.locals.processed = true;
      response.send({ data: result });
      return next();
    }
    return next({
      type: 204,
      message: 'No wallets found',
    });
  } catch (error) {
    logger.error(`Error caught under setupController in wallet.controller.js ${error}`);
    return next(error);
  }
};

exports.setupController = async (request, response, next) => {
  try {
    // Create a wallet and update a transaction
    const result = await createWallet(request.body);
    // eslint-disable-next-line dot-notation
    const transaction = await createTransaction(result['_id'], transactionConst.type.create.wallet, {
      walletBalance: request.body.walletBalance || 0,
      transactionAmount: 0,
    });

    response.locals.processed = true;
    response.status(201).send({
      status: true,
      id: result['_id'],
      transactionId: transaction['_id'],
      balance: request.body.walletBalance,
      name: request.body.walletName,
      date: result['createdAt'],
    });

    return next();
  } catch (error) {
    if (errorCodes[error.code]) {
      // In case a mongodb error code is returned
      return next({
        type: errorCodes[error.code].status,
        message: errorCodes[error.code].message,
      });
    }
    logger.error(`Error caught under setupController in wallet.controller.js ${error}`);
    return next(error);
  }
};
