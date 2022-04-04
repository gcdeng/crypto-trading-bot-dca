/**
 * This is a example order parameters represents to purchase cryptocurrencies by each percentage in portfolio with 400 USDT.
 *
 * if you don't have sufficient balance (less than 400 USDT in this example) in your account then the purchase will fail. The bot will try to make another purchase on the next scheduled time.
 */

// set crypto symbol and percentage you want to buy
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

// your preferred stablecoin symbol for payment
const quoteCurrency = "USDT";

// how much you want to buy
const grantTotalAmount = 400; // grant total available balance of quoteCurrency in your account if grantTotalAmount set to 'all'

module.exports = { portfolio, quoteCurrency, grantTotalAmount };
