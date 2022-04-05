# crypto-trading-bot-dca

> A cryptocurrency trading bot to help you implement [dollar-cost averaging (DCA)](https://www.investopedia.com/terms/d/dollarcostaveraging.asp) investment strategy automatically in FTX Pro exchange.

This bot allows you to configure your portfolio and place limit buy orders to purchase crypto regularly in FTX Pro. It is similar to [Auto-Invest Plan in Binance](https://www.binance.com/en/savings/auto-invest) or [屯幣寶 in Pionex](https://www.pionex.com/blog/zh/pionex-rebalancingbot-tw/) but with less fees.

## Environment

Node v14+

## Installation

```shell
npm install
```

## How to use

You can use this project by following two different ways:

1. run it manually once if you want.
2. run it automatically at a recurring cycle on how often you want to buy crypto by deploying a cron-like serverless service on AWS.

### How to run it manually

1. create `.env` in root folder and configure your FTX api secrets.

   > **Warning**: do not commit your secrets in .env to git

   ```text
   API_KEY=YOUR_FTX_API_KEY
   API_SECRET=YOUR_FTX_API_SECRET
   ```

2. configure portfolio and order parameters in `parameters.js`.

   In short,

   - set crypto symbol and percentage you want to buy.
   - set how much you want to buy and stablecoin symbol that your preferred for payment.

   check out that file for more details.

3. start the bot

   ```shell
   npm start
   ```

   the bot will start placing orders but only one time.

### How to run it automatically at a recurring cycle

This project will deploy a cron-like serverless service running on AWS Lambda & EventBridge using [Serverless Framework](https://www.serverless.com/). The event scheduler created on AWS EventBridge will trigger our investment function which running on AWS Lambda at specific time or in specific intervals you configured.

1. [setup your Serverless Framework & AWS account](https://www.serverless.com/framework/docs/getting-started)

2. configure your FTX api secrets in [Serverless Dashboard parameters](https://www.serverless.com/framework/docs/guides/parameters#serverless-dashboard-parameters).

3. configure order parameters in `parameters.js`.

4. create event scheduler in `serverless.yml` which is used for configuring functions to be executed at specific time or in specific intervals.

   example:

   ```yml
   events:
     - schedule:
         rate: cron(0 0 ? * SAT *) # Invoke Lambda function every Saturday at 00:00:00 GMT
         enabled: true # set to false then re-deploy if you want to pause the bot
   ```

   Detailed information about cron expressions is available in official [AWS docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions).

5. Deployment

   ```shell
   npm run deploy
   ```

   That’s it! Our investment function is running on a schedule, it will automatically be trigger at next scheduled time.

## FAQ

1. How to update order parameters after deploy?

   update `parameters.js` then run `npm run deploy` to redeploy.

2. How to update FTX secretes?

   update it on serverless dashboard then redeploy.

3. How to pause service on AWS?

   disable event scheduler by switching `enabled` flag to `false` in `serverless.yml` then redeploy.

4. How to remove service/stop bot on AWS?

   ```shell
   npm run remove
   ```

## Disclaimer

No Investment Advice & Do Your Own Research

## Reference

<https://www.serverless.com/framework/docs>

<https://www.serverless.com/examples/aws-node-scheduled-cron>

<https://www.serverless.com/blog/cron-jobs-on-aws>

<https://eqolot.com/technologie/blog/running-cron-jobs-on-aws-lambda-with-scheduled-events>
