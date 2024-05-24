const express = require("express");
const transactionSchema = require("../schemas/transactionSchema");

const balanceRouter = express.Router();

balanceRouter.route("/balance").post(async (req, res) => {
  const { timestamp } = req.body;
  //   res.json(timestamp);
  //   const date = new Date(timestamp);
  const date = Date.parse(timestamp);
  console.log("DATE", date);

  try {
    const transactions1 = await transactionSchema.find({});
    // console.log(transactions1);
    const transactions = [];
    for (tran of transactions1) {
      //   console.log(tran);
      const date1 = Date.parse(tran.utc_time);
      if (date >= date1) {
        transactions.push(tran);
        console.log(date1 <= date);
        console.log(tran);
      }
    }
    console.log(transactions);
    const balances = {};
    transactions.forEach((transaction) => {
      const [asset] = transaction.market.split("/");
      if (!balances[asset]) {
        balances[asset] = 0;
      }
      if (transaction.operation === "Buy") {
        balances[asset] += transaction.buy_sell_amount;
      } else if (transaction.operation === "Sell") {
        balances[asset] -= transaction.buy_sell_amount;
      }
    });

    res.json(balances);
  } catch (err) {
    console.log(err);
    res.status(500).json("failed");
  }
});

module.exports = balanceRouter;
