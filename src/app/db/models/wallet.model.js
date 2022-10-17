const { Schema } = require('mongoose');

const Wallet = new Schema({
  walletName: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  walletBalance: { type: Number, required: false, default: 0 },
});

module.exports = Wallet;
