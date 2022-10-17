const { connectToDatabase: db, getObjectId } = require('../db/index');

// Creates a transaction
exports.createTransaction = async (walletId, transactionType, data) => {
  const { Transaction } = await db();
  const result = await Transaction.create({
    walletId: getObjectId(walletId),
    type: transactionType,
    ...data,
  });
  return result;
};

// Get count of transactions
exports.getTransactionCount = async (walletId = null) => {
  let query = {};
  if (walletId) {
    query = { walletId };
  }
  const { Transaction } = await db();
  const count = Transaction.count(query);

  return count;
};

// Get transactions
exports.getTransactions = async (walletId, metadata) => {
  const limit = metadata.limit || 2;
  const skip = metadata.skip ? metadata.skip * limit : 0;
  const sortColumn = metadata.sortColumn && metadata.sortColumn.length ? metadata.sortColumn.split(',') : [];
  const sortOrder = metadata.sortOrder || 1;
  let sortRule = {};
  if (sortColumn.length) {
    sortColumn.forEach((column) => {
      sortRule[column] = Number(sortOrder);
    });
  } else sortRule = { createdAt: 1 };

  const { Transaction } = await db();
  const result = await Transaction.find({
    walletId: getObjectId(walletId),
  }, '-__v')
    .sort(sortRule)
    .skip(skip)
    .limit(limit);

  return {
    data: result,
    page: skip,
    limit,
  };
};
