/* eslint-disable dot-notation */
// const { errorCodes } = require('../../utils/config/mongo.config');
// const { logger } = require('../../utils/loggers/winston.logger');

const { getObjectId } = require('../db/index');
const { logger } = require('../../utils/loggers/winston.logger');
const { getTransactions, getTransactionCount, createTransaction } = require('../helpers/transaction.helpers');
const { creditWallet, debitWallet, getWallet } = require('../helpers/wallet.helpers');

exports.listTransactions = async (request, response, next) => {
  try {
    const { walletId } = request.query;
    const result = await getTransactions(walletId, request.query);
    response.locals.processed = true;
    response.send({
      ...result,
      total: Math.floor(await getTransactionCount(walletId) / request.query.limit),
    } || []);
    return next();
  } catch (error) {
    logger.error(`Error caught under listTransactions in transaction.controller.js ${error}`);
    return next(error);
  }
};

exports.makeTransaction = async (request, response, next) => {
  try {
    const { walletId, amount, description } = request.body;
    let result;
    let type;
    if (amount > 0) {
      // Credit account
      type = 'credit';
      result = await creditWallet(getObjectId(walletId), amount);
    }
    if (amount < 0) {
      // Debit account
      type = 'debit';
      result = await debitWallet(getObjectId(walletId), amount);
    }
    const wallet = await getWallet(walletId);
    if (wallet) {
      // If record was modified then a transaction occurred else balance low
      if (result.modifiedCount === 0) {
        return next({
          type: 400,
          message: 'Cannot make this transaction please check balance',
        });
      }
      const transaction = await createTransaction(walletId, type, {
        walletBalance: wallet.walletBalance,
        transactionAmount: Math.abs(amount),
        description,
      });
      response.locals.processed = true;
      response.send({
        balance: wallet.walletBalance,
        transactionId: transaction['_id'],
      });
      return next();
    }
    // If flow came here then we couldnt find wallet
    return next({
      type: 400,
      message: 'Invalid wallet id',
    });
  } catch (error) {
    logger.error(`Error caught under makeTransaction in transaction.controller.js ${error}`);
    return next(error);
  }
};
