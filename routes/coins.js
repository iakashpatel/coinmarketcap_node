require("../db/db");
var express = require("express");
var router = express.Router();
var { authCheck } = require("../middlewares/auth");
var dev = process.env.NODE_ENV !== "production";

const { pullDataAndStore, getTodaysDate, getData } = require("../utils/cmc");

/* GET users listing. */
router.get("/", authCheck, async function(req, res) {
  try {
    const data = await getData();
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "something went wrong" });
  }
});

router.get("/refresh", authCheck, async function(req, res) {
  try {
    if (!dev) {
      const day = getTodaysDate();
      const apiurl = "https://pro-api.coinmarketcap.com";
      // change coin limit
      const coinsLimit = 50;

      await pullDataAndStore(apiurl, day, coinsLimit);
      return res.send({ success: true });
    } else {
      return res.send({ success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "something went wrong" });
  }
});

module.exports = router;
