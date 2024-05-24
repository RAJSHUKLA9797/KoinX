const mongoose = require("mongoose");
const express = require("express");
const transactionSchema = new mongoose.Schema({
  //   title: { type: String, required: true },
  user_id: { type: String },
  utc_time: { type: String },
  operation: { type: String },
  market: { type: String },
  buy_sell_amount: { type: Number },
  price: { type: Number },
});

const TransactionSchema = mongoose.model(
  "TransactionSchema",
  transactionSchema
);

module.exports = TransactionSchema;
