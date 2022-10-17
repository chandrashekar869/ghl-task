const router = require('express').Router();

const { makeTransaction, listTransactions } = require('../controllers/transaction.controller');
// const {  } = require('../controllers/transaction.controller');
const { transactValidator, listTransactValidator } = require('../middleware/validators/transaction');

router.post('/transact/:walletId', transactValidator, makeTransaction);
router.get('/', listTransactValidator, listTransactions);

module.exports = (app) => {
  app.use('/transactions', router);
};
