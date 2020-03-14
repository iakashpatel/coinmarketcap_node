const Agenda = require("agenda");
const {
  generateDates,
  pullDataAndStore,
  getTodaysDate
} = require("../utils/cmc");
const Tickers = require("../models/tickers");

var mongoDB = process.env.MONGO_URI || "mongodb://localhost:27017/primesite";
const agenda = new Agenda({ db: { address: mongoDB } });
var dev = process.env.NODE_ENV !== "production";

function loadDevSandboxData() {
  try {
    const apiurl = "https://sandbox-api.coinmarketcap.com";
    // change coin limit
    const coinsLimit = 50;

    const startDay = "2019-08-29";
    const dates = generateDates(startDay, 12);

    return dates.reverse().reduce((acc, date) => {
      return acc.then(() => pullDataAndStore(apiurl, date, coinsLimit));
    }, Promise.resolve()); // initial
  } catch (error) {
    console.log("error during loading sandbox data", error);
  }
}

function loadRealLast90DaysData() {
  try {
    const apiurl = "https://pro-api.coinmarketcap.com";
    // change coin limit
    const coinsLimit = 150;

    const startDay = getTodaysDate();
    const dates = generateDates(startDay, 90);

    return dates.reverse().reduce((acc, date) => {
      return acc.then(() => pullDataAndStore(apiurl, date, coinsLimit));
    }, Promise.resolve()); // initial
  } catch (error) {
    console.log("error during loading sandbox data", error);
  }
}

async function loadInitialData() {
  if (dev) {
    // NODE_ENV = other than production
    // delete and insert
    Tickers.deleteMany({})
      .then(() => {
        loadDevSandboxData();
      })
      .catch(error => console.log(error));
  } else {
    // NODE_ENV = production
    Tickers.deleteMany({})
      .then(() => {
        loadRealLast90DaysData();
      })
      .catch(error => console.log(error));
  }
}

agenda.define("pull cmc data and save to database", async job => {
  if (!dev) {
    const day = getTodaysDate();
    const apiurl = "https://pro-api.coinmarketcap.com";
    // change coin limit
    const coinsLimit = 50;

    await pullDataAndStore(apiurl, day, coinsLimit);
  }
});

(async function() {
  await loadInitialData();

  await agenda.start();

  // Alternatively, you could also do:
  await agenda.every("*/5 * * * *", "pull cmc data and save to database");
})();
