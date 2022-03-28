require("dotenv").config();
const ccxt = require("ccxt");
const { portfolio, quoteCurrency, minBalance } = require("./parameters");
// const axios = require("axios");

// connect exchange
const exchange = new ccxt[process.env.EXCHANGE_ID]({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
});
// console.log(exchange.requiredCredentials); // prints required credentials
exchange.checkRequiredCredentials(); // throw AuthenticationError
const rateLimitDelay = parseInt(process.env.RATE_LIMIT_DELAY); // milliseconds = seconds * 1000

// TODO: allocate portfolio percentage by market cap
// const cmcApiHost = "pro-api.coinmarketcap.com";
// const cmcIdMap = {
//   BTC: "1",
//   ETH: "1027",
//   BNB: "1839",
//   FTT: "4195",
//   SOL: "5426",
//   LUNA: "4172",
//   DOT: "6636",
//   AVAX: "5805",
//   ATOM: "3794",
// };

const main = async () => {
  // check balance
  const balance = await exchange.fetchBalance();
  const quoteCurrencyBalance = balance?.[quoteCurrency]?.free || 0;
  console.log("quoteCurrencyBalance: ", quoteCurrencyBalance, quoteCurrency);
  console.log("minBalance: ", minBalance[quoteCurrency], quoteCurrency);
  if (quoteCurrencyBalance < minBalance[quoteCurrency]) {
    // TODO: handle Insufficient balance
    console.log("Insufficient quoteCurrencyBalance");
    return;
  }

  console.log("---");

  for (const baseCurrency in portfolio) {
    if (
      portfolio[baseCurrency] !== 0 &&
      Object.hasOwnProperty.call(portfolio, baseCurrency)
    ) {
      const symbol = `${baseCurrency}/${quoteCurrency}`;
      console.log("symbol", symbol);

      // get market price
      const ticker = await exchange.fetchTicker(symbol);
      const currentMarketPrice = ticker.ask;
      console.log("current market ask price", currentMarketPrice);

      // calculate limit buy order price
      const limitBuyOrderPrice =
        currentMarketPrice - (currentMarketPrice * 1) / 1000;
      console.log("limit buy order price", limitBuyOrderPrice);

      // calculate quoteCurrency amount
      const quoteCurrencyAmount =
        (quoteCurrencyBalance * portfolio[baseCurrency]) / 100;
      console.log("quoteCurrencyAmount:", quoteCurrencyAmount, quoteCurrency);

      // calculate baseCurrency amount
      const baseCurrencyAmount = quoteCurrencyAmount / limitBuyOrderPrice;
      console.log("baseCurrencyAmount:", baseCurrencyAmount, baseCurrency);

      // place limit buy order
      const limitBuyOrder = await exchange.createLimitBuyOrder(
        symbol,
        baseCurrencyAmount,
        limitBuyOrderPrice
      );
      console.log("place limit buy order: ", limitBuyOrder);

      // delay for rate limit
      console.log("delay for rate limit", rateLimitDelay, "ms");
      console.log("---");
      await new Promise((resolve) => setTimeout(resolve, rateLimitDelay));
    }
  }
};

main();
