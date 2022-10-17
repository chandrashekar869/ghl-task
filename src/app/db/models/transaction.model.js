const { Schema } = require('mongoose');

const Transaction = new Schema({
  walletId: { type: Schema.Types.ObjectId, required: true },
  walletBalance: { type: Number, required: true },
  transactionAmount: { type: Number, required: true },
  description: { type: String, required: false },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = Transaction;
