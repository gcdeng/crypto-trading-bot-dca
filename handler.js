require("dotenv").config();
const ccxt = require("ccxt");
const parameters = require("./parameters");

module.exports.run = async () => {
  console.log("parameters", parameters);
  const { portfolio, quoteCurrency, grantTotalAmount } = parameters;
  if (!portfolio) {
    throw new Error("portfolio parameter is required.");
  }

  if (!quoteCurrency) {
    throw new Error("quoteCurrency parameter is required.");
  }

  if (!grantTotalAmount) {
    throw new Error("grantTotalAmount parameter is required.");
  }

  if (!process.env.API_KEY) {
    throw new Error("API_KEY is required.");
  }
  if (!process.env.API_SECRET) {
    throw new Error("API_SECRET is required.");
  }

  const exchangeId = process.env.EXCHANGE_ID || "ftx";

  // connect exchange
  const exchange = new ccxt[exchangeId]({
    apiKey: process.env.API_KEY,
    secret: process.env.API_SECRET,
  });
  exchange.checkRequiredCredentials(); // throw AuthenticationError

  // validate quoteCurrencyBalance
  const balance = await exchange.fetchBalance();
  const quoteCurrencyBalance = balance?.[quoteCurrency]?.free || 0;
  console.log("quoteCurrencyBalance: ", quoteCurrencyBalance, quoteCurrency);
  if (!quoteCurrencyBalance) {
    throw new Error("Insufficient quoteCurrencyBalance");
  }

  // validate grantTotalAmount
  let _grantTotalAmount;
  if (
    typeof grantTotalAmount === "string" &&
    grantTotalAmount.toLowerCase() === "all"
  ) {
    // grant all quoteCurrencyBalance
    _grantTotalAmount = quoteCurrencyBalance;
  } else if (typeof grantTotalAmount === "number") {
    if (quoteCurrencyBalance < grantTotalAmount) {
      // ensure sufficient quoteCurrencyBalance
      throw new Error("Insufficient quoteCurrencyBalance");
    }
    _grantTotalAmount = grantTotalAmount;
  }

  if (!_grantTotalAmount) {
    // if grantTotalAmount is invalid or equal to 0
    throw new Error("wrong grantTotalAmount parameter");
  }
  console.log("grantTotalAmount: ", _grantTotalAmount, quoteCurrency);

  console.log("\n---start placing limit buy orders---\n");

  for (const [baseCurrency, percentage] of Object.entries(portfolio)) {
    if (percentage === 0) continue;

    // get market symbol
    const symbol = `${baseCurrency}/${quoteCurrency}`;
    console.log("symbol:", symbol);

    // calculate quoteCurrency amount
    const quoteCurrencyAmount = (_grantTotalAmount * percentage) / 100;
    console.log("quoteCurrencyAmount:", quoteCurrencyAmount, quoteCurrency);

    // get ticker
    let ticker;
    try {
      ticker = await exchange.fetchTicker(symbol);
    } catch (error) {
      console.error(error);
      continue; // continue to place next order
    }

    // // get market price
    // const currentMarketPrice = ticker.ask;
    // console.log("current market ask price:", currentMarketPrice);

    // calculate limit buy order price
    const limitBuyOrderPrice = ticker.bid;
    console.log(
      "set limit buy order price to current market bid price:",
      limitBuyOrderPrice
    );

    // calculate baseCurrency amount
    const baseCurrencyAmount = quoteCurrencyAmount / limitBuyOrderPrice;
    console.log("baseCurrencyAmount:", baseCurrencyAmount, baseCurrency);

    // place limit buy order
    try {
      const limitBuyOrder = await exchange.createLimitBuyOrder(
        symbol,
        baseCurrencyAmount,
        limitBuyOrderPrice
      );
      console.log("placed limit buy order: ", limitBuyOrder, "\n");
    } catch (error) {
      console.error(error, "\n");
      continue; // continue to place next order
    }
  }

  console.log("---all orders are placed---");
};
