// parameters for DCA strategy
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

const grantTotalAmount = 400; // grant total available balance in your account if 0

module.exports = { portfolio, quoteCurrency, grantTotalAmount };
