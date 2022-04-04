/**
 * This is a example order parameters represents to purchase cryptocurrencies by each percentage in portfolio with 400 USDT.
 * In this example, you must have at least 400 USDT in your account to ensure the bot works as expected.
 */

// baseCurrency and percentage
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

const grantTotalAmount = 400; // grant total available balance of quoteCurrency in your account if grantTotalAmount set to 'all'

module.exports = { portfolio, quoteCurrency, grantTotalAmount };
