const router = require('express').Router();

const { setupController, listWalletController, listWalletsController } = require('../controllers/wallet.controller');
const { setupValidator, listWalletValidator } = require('../middleware/validators/wallet');

router.post('/setup', setupValidator, setupController);
router.get('/:walletId', listWalletValidator, listWalletController);
router.get('/', listWalletsController);

module.exports = (app) => {
  app.use('/wallet', router);
};
