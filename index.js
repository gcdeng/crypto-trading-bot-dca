require("dotenv").config();
const ccxt = require("ccxt");
const { portfolio, quoteCurrency, grantTotalAmount } = require("./parameters");

const rateLimitDelay = parseInt(process.env.RATE_LIMIT_DELAY);

const exchangeId = process.env.EXCHANGE_ID || "ftx";

// connect exchange
const exchange = new ccxt[exchangeId]({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
});
exchange.checkRequiredCredentials(); // throw AuthenticationError

const main = async () => {
  // check balance
  const balance = await exchange.fetchBalance();
  const quoteCurrencyBalance = balance?.[quoteCurrency]?.free || 0;
  console.log("quoteCurrencyBalance: ", quoteCurrencyBalance, quoteCurrency);
  console.log("grantTotalAmount: ", grantTotalAmount, quoteCurrency);
  if (quoteCurrencyBalance < grantTotalAmount) {
    throw new Error("Insufficient quote currency balance");
  }
  let _grantTotalAmount = grantTotalAmount;
  if (_grantTotalAmount === 0) {
    _grantTotalAmount = quoteCurrencyBalance;
  }

  console.log("\n---start placing limit buy orders---\n");

  for (const [baseCurrency, percentage] of Object.entries(portfolio)) {
    if (percentage === 0) break;
    const symbol = `${baseCurrency}/${quoteCurrency}`;
    console.log("symbol:", symbol);

    // calculate quoteCurrency amount
    const quoteCurrencyAmount = (_grantTotalAmount * percentage) / 100;
    console.log("quoteCurrencyAmount:", quoteCurrencyAmount, quoteCurrency);

    // get market price
    const ticker = await exchange.fetchTicker(symbol);
    const currentMarketPrice = ticker.ask;
    console.log("current market ask price:", currentMarketPrice);

    // calculate limit buy order price
    const limitBuyOrderPrice =
      currentMarketPrice - (currentMarketPrice * 1) / 1000;
    console.log("limit buy order price:", limitBuyOrderPrice);

    // calculate baseCurrency amount
    const baseCurrencyAmount = quoteCurrencyAmount / limitBuyOrderPrice;
    console.log("baseCurrencyAmount:", baseCurrencyAmount, baseCurrency);

    // place limit buy order
    const limitBuyOrder = await exchange.createLimitBuyOrder(
      symbol,
      baseCurrencyAmount,
      limitBuyOrderPrice
    );
    console.log("placed limit buy order: ", limitBuyOrder, "\n");

    // delay for rate limit
    await new Promise((resolve) => setTimeout(resolve, rateLimitDelay));
  }

  console.log("---all orders are placed---");
};

main();
