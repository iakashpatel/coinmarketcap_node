const Agenda = require("agenda");
const CoinMarketCap = require("coinmarketcap-api");
const Tickers = require("../models/tickers");
var mongoDB = process.env.MONGO_URI || "mongodb://localhost:27017/primesite";

const agenda = new Agenda({ db: { address: mongoDB } });

// CMC API KEY
const apiKey = process.env.COINMARKETCAP_APIKEY || "";
// config - first x coins
const tickers_limit = 2; // change this

const client = new CoinMarketCap(apiKey);

async function createNewTicker(
  name,
  symbol,
  cmc_rank,
  price,
  volume_24h,
  market_cap,
  last_updated
) {
  try {
    const ticker = new Tickers({
      name: name,
      ticker: symbol,
      marketcap_rank: cmc_rank,
      price_usd: price,
      volumne: volume_24h,
      marketcap_usd: market_cap,
      timestamp: last_updated,
      updated_timestamp: new Date(last_updated).getTime()
    });
    ticker.save();
  } catch (error) {
    console.log("createNewTicker#error--->", error);
  }
}

// pull data
async function fetchDetils() {
  try {
    const result = await client.getTickers({
      convert: "USD",
      limit: tickers_limit
    });
    const { data = [] } = result;
    data.map(async item => {
      const { quote = {}, name, cmc_rank, symbol } = item;
      const { USD = {} } = quote;
      const { price, volume_24h, market_cap, last_updated } = USD;
      let ticker = await Tickers.findOne({ ticker: symbol });

      if (ticker) {
        const currentDay =
          new Date(last_updated).getTime() -
            new Date(updated_timestamp).getTime() >=
          86400000
            ? false
            : true;

        if (currentDay) {
          ticker.name = name;
          ticker.marketcap_rank = cmc_rank;
          ticker.price_usd = price;
          ticker.volumne = volume_24h;
          ticker.marketcap_usd = market_cap;
          ticker.timestamp = last_updated;
          ticker.updated_timestamp = new Date(last_updated).getTime();
          ticker.save();
        } else {
          createNewTicker(
            name,
            symbol,
            cmc_rank,
            price,
            volume_24h,
            market_cap,
            last_updated
          );
        }
      } else {
        createNewTicker(
          name,
          symbol,
          cmc_rank,
          price,
          volume_24h,
          market_cap,
          last_updated
        );
      }
      console.log(`[INFO]: SAVED: [${last_updated}]-[${symbol}]`);
    });
  } catch (error) {
    console.log("error while pulling data---->", error);
  }
}

agenda.define("pull cmc data and save to database", async job => {
  await fetchDetils();
});

(async function() {
  await agenda.start();

  // Alternatively, you could also do:
  await agenda.every("*/5 * * * *", "pull cmc data and save to database");
})();
