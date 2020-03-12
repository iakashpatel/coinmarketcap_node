//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var TickerSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  price_usd: {
    type: Number,
    require: true
  },
  ticker: {
    type: String,
    require: true
  },
  volume: {
    type: Number,
    require: true
  },
  marketcap_usd: {
    type: Number,
    require: true
  },
  marketcap_rank: {
    type: Number,
    require: true
  },
  timestamp: {
    type: String,
    require: true
  },
  updated_timestamp:{
    type: Number,
    require: true
  }
});

var Tickers = mongoose.model("Tickers", TickerSchema);

module.exports = Tickers;
