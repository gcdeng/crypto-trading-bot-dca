// parameters for DCA plan
const portfolio = {
  BTC: 20,
  ETH: 20,
  BNB: 10,
  FTT: 10,
  SOL: 8,
  LUNA: 8,
  AVAX: 8,
  DOT: 8,
  ATOM: 8,
};

const quoteCurrency = "USDT";

const minBalance = {
  USDT: 100,
};

module.exports = { portfolio, quoteCurrency, minBalance };
