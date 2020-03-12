require("../db/db");
var express = require("express");
var router = express.Router();
var { authCheck } = require("../middlewares/auth");
const Tickers = require("../models/tickers");
const _ = require("lodash");

/* GET users listing. */
router.get("/", authCheck, async function(req, res) {
  try {
    const coins = await Tickers.find().sort({
      updated_timestamp: -1
    });
    const history_coins = _.chain(
      _.sortBy(coins, [
        function(o) {
          return o.marketcap_rank;
        }
      ])
    )
      .groupBy("ticker")
      .map((value, key) => ({ ticker: key, data: value }))
      .value();
    return res.send({ coins: history_coins });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "something went wrong" });
  }
});

module.exports = router;
