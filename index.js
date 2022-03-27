const ccxt = require("ccxt");
require("dotenv").config();
// const axios = require("axios");

const exchange = new ccxt[process.env.EXCHANGE_ID]({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
});
// const cmcApiHost = "pro-api.coinmarketcap.com";
// console.log(exchange.requiredCredentials); // prints required credentials
exchange.checkRequiredCredentials(); // throw AuthenticationError
const rateLimitDelay = parseInt(process.env.RATE_LIMIT_DELAY); // milliseconds = seconds * 1000

// TODO: allocate portfolio percentage by market cap
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

const portfolioPercentage = {
  BTC: 20,
  ETH: 10,
  BNB: 10,
  FTT: 10,
  SOL: 10,
  LUNA: 10,
  AVAX: 10,
  DOT: 10,
  ATOM: 10,
};

const quoteCurrency = "USDT";
const minBalance = {
  USDT: 100,
};

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

  for (const baseCurrency in portfolioPercentage) {
    if (
      portfolioPercentage[baseCurrency] !== 0 &&
      Object.hasOwnProperty.call(portfolioPercentage, baseCurrency)
    ) {
      // const percentage = portfolioPercentage[baseCurrency];
      // get market price
      const symbol = `${baseCurrency}/${quoteCurrency}`;
      console.log("symbol", symbol);

      const ticker = await exchange.fetchTicker(symbol);
      const currentMarketPrice = ticker.ask;
      console.log("current market ask price", currentMarketPrice);

      const limitBuyOrderPrice =
        currentMarketPrice - (currentMarketPrice * 5) / 1000;
      console.log("limit buy order price", limitBuyOrderPrice);

      const quoteCurrencyAmount =
        (quoteCurrencyBalance * portfolioPercentage[baseCurrency]) / 100;
      console.log("quoteCurrencyAmount:", quoteCurrencyAmount, quoteCurrency);

      const baseCurrencyAmount = quoteCurrencyAmount / limitBuyOrderPrice;
      console.log("baseCurrencyAmount:", baseCurrencyAmount, baseCurrency);

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
