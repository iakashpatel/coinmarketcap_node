const apiKey = process.env.COINMARKETCAP_APIKEY || "";

const axios = require("axios");
const Tickers = require("../models/tickers");

const createNewTicker = async (
  name,
  symbol,
  cmc_rank,
  price,
  volume_24h,
  market_cap,
  last_updated
) => {
  try {
    const ticker = new Tickers({
      name: name,
      ticker: symbol,
      marketcap_rank: cmc_rank,
      price_usd: price,
      volume: volume_24h,
      marketcap_usd: market_cap,
      timestamp: last_updated,
      updated_timestamp: new Date(last_updated).getTime()
    });
    ticker.save();
  } catch (error) {
    console.log("createNewTicker#error--->", error);
  }
};

const fetchCoins = async (
  apiurl = "https://sandbox-api.coinmarketcap.com",
  day = getTodaysDate(),
  coinsLimit = 50
) => {
  try {
    let url = `${apiurl}/v1/cryptocurrency/listings/historical?start=1&limit=${coinsLimit}&convert=USD&date=${day}`;
    var inputDate = new Date(day);

    var todaysDate = new Date();

    // if current date get latest data of today
    if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
      url = `${apiurl}/v1/cryptocurrency/listings/latest?start=1&limit=${coinsLimit}&convert=USD`;
    }

    const result = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json"
      }
    });
    const { data } = result;

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const doubleDigitNumber = number => {
  if (number.toString().length === 1) {
    return "0" + number.toString();
  }
  return number.toString();
};

const getTodaysDate = () => {
  let d = new Date();
  const stringDate = `${d.getFullYear()}-${doubleDigitNumber(
    d.getMonth() + 1
  )}-${doubleDigitNumber(d.getDate())}`;
  return stringDate;
};

// YYYY-MM-DD
const generateDates = (startDate = getTodaysDate(), totalDays = 90) => {
  let arrayDate = [];
  arrayDate.push(startDate);
  for (let i = 1; i <= totalDays; i++) {
    const date = Object.assign([], arrayDate).pop();
    let d = new Date(date);
    d.setDate(d.getDate() - 1);
    const stringDate = `${d.getFullYear()}-${doubleDigitNumber(
      d.getMonth() + 1
    )}-${doubleDigitNumber(d.getDate())}`;
    arrayDate.push(stringDate);
  }
  return arrayDate;
};

// pull data and store to mongodb
const pullDataAndStore = async (
  apiurl = "https://sandbox-api.coinmarketcap.com",
  day = getTodaysDate(),
  coinsLimit = 50
) => {
  try {
    const result = await fetchCoins(apiurl, day, coinsLimit);
    const { data = [] } = result;
    data.map(async item => {
      const { quote = {}, name, cmc_rank, symbol } = item;
      const { USD = {} } = quote;
      const { price, volume_24h, market_cap, last_updated } = USD;
      let ticker = await Tickers.findOne({ ticker: symbol }).sort({
        updated_timestamp: -1
      });

      if (ticker) {
        const [curDay = ""] = last_updated.split("T");
        const [prevDay = ""] = ticker.timestamp.split("T");
        const nextDay =
          new Date(curDay).setHours(0, 0, 0, 0) -
            new Date(prevDay).setHours(0, 0, 0, 0) >=
          86400000;

        if (!nextDay) {
          ticker.name = name;
          ticker.marketcap_rank = cmc_rank;
          ticker.price_usd = price;
          ticker.volume = volume_24h;
          ticker.marketcap_usd = market_cap;
          ticker.timestamp = last_updated;
          ticker.updated_timestamp = new Date(last_updated).getTime();
          ticker.save();
          console.log(`[UPDATED]: SAVED: [${last_updated}]-[${symbol}]`);
          return;
        } else {
          const tickerCount = await Tickers.countDocuments({ ticker: ticker.ticker });
          if (tickerCount > 90) {
            const firstTicker = await Tickers.findOne({ ticker: symbol }).sort({
              updated_timestamp: 1
            });
            firstTicker && (await firstTicker.remove());
          }
          createNewTicker(
            name,
            symbol,
            cmc_rank,
            price,
            volume_24h,
            market_cap,
            last_updated
          );
          console.log(`[OVERWRITTEN]: SAVED: [${last_updated}]-[${symbol}]`);
          return;
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
        console.log(`[INFO]: SAVED: [${last_updated}]-[${symbol}]`);
        return;
      }
    });
  } catch (error) {
    console.log("error while pulling data---->", error);
    return;
  }
};

module.exports = {
  generateDates,
  pullDataAndStore,
  getTodaysDate
};
