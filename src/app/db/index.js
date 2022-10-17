const mongoose = require('mongoose');
const _ = require('lodash');

const { mongoConfig, getConnectionString } = require('../../utils/config/mongo.config');
const { logger } = require('../../utils/loggers/winston.logger');

// ---------------- SCHEMAS IMPORT START ----------------
const WalletSchema = require('./models/wallet.model');
const TransactionSchema = require('./models/transaction.model');
// ---------------- SCHEMAS IMPORT END ------------------

let connections;
let models;

const getObjectId = (str) => mongoose.Types.ObjectId(str);

const createModels = () => {
  const { payments } = connections;
  return {
    Wallet: payments.useDb('payments-app').model('wallet', WalletSchema, 'wallet'),
    Transaction: payments.useDb('payments-app').model('transaction', TransactionSchema, 'transaction'),
  };
};

const connectToDatabase = () => new Promise((resolve, reject) => {
  try {
    if (connections) {
      // eslint-disable-next-line no-promise-executor-return
      return resolve(models);
    }
    const connectionString = getConnectionString();
    logger.info(`Starting mongo db connection ${connectionString}`);

    const payments = mongoose.createConnection(connectionString, mongoConfig.prerequisites);
    connections = { payments };

    Object.keys(connections).forEach((connection) => {
      connections[connection].once('open', () => {
        logger.info(`Database: ${connection} connected`);
      }).once('close', () => {
        throw new Error(` Failed to Establish Mongodb connections- ${connection}`);
      });
    });

    // eslint-disable-next-line no-promise-executor-return
    return Promise.all(_.values(connections))
      .then(() => {
        models = createModels();
        resolve(models);
        logger.info(`Completed mongo db connection ${connectionString}`);
      });
  } catch (error) {
    logger.error(`Error caught in connection.mongoDb: ${error.message}`);
    // eslint-disable-next-line no-promise-executor-return
    return reject(error);
  }
});

module.exports = {
  connectToDatabase,
  getObjectId,
};
