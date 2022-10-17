const { connectToDatabase: db, getObjectId } = require('../db/index');

// Creates a wallet
exports.createWallet = async ({ walletName, walletBalance }) => {
  const { Wallet } = await db();
  const result = await Wallet.create({
    walletName,
    walletBalance,
  });
  return result;
};

// Get a wallet
exports.getWallets = async (walletId = null) => {
  let query = {};
  if (walletId) query = { _id: getObjectId(walletId) };
  const { Wallet } = await db();
  const result = await Wallet.find(query, '-__v');
  return result;
};

// Debits a wallet
exports.debitWallet = async (walletId, amount) => {
  const { Wallet } = await db();
  const result = await Wallet.updateOne(
    {
      _id: getObjectId(walletId),
      walletBalance: { $gte: Math.abs(amount) },
    },
    { $inc: { walletBalance: amount } },
  );
  return result;
};

// Credits a wallet
exports.creditWallet = async (walletId, amount) => {
  const { Wallet } = await db();
  const result = await Wallet.updateOne(
    {
      _id: getObjectId(walletId),
    },
    { $inc: { walletBalance: amount } },
  );
  return result;
};

// Gets a wallet
exports.getWallet = async (walletId) => {
  const { Wallet } = await db();
  const result = await Wallet.findOne(
    {
      _id: getObjectId(walletId),
    },
  );
  return result;
};
