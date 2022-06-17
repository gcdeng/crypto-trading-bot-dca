/**
 * This is a example order parameters represents to purchase cryptocurrencies by each percentage in portfolio with {grantTotalAmount} USDT.
 *
 * if you don't have sufficient balance (less than {grantTotalAmount} USDT in this example) in your account then the purchase will fail. The bot will try to make another purchase on the next scheduled time.
 */

// set crypto symbol and percentage you want to buy
const portfolio = {
  BTC: 40,
  ETH: 60,
};

// your preferred stablecoin symbol for payment
const quoteCurrency = "USDT";

// how much you want to buy
const grantTotalAmount = 20; // grant total available balance of quoteCurrency in your account if grantTotalAmount set to 'all'

module.exports = { portfolio, quoteCurrency, grantTotalAmount };
