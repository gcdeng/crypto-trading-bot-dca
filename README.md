# crypto-trading-bot-dca

A cryptocurrency trading bot to implement [dollar-cost averaging (DCA)](https://www.investopedia.com/terms/d/dollarcostaveraging.asp) investment strategy in FTX Pro exchange.

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
2. set a recurring cycle on how often you want to buy crypto then run it automatically by deploy a CronJob service on AWS Lambda.

### How to run it manually

1. create `.env` in root folder and configure your FTX api secrets.

   > Note: do not commit your secrets in .env to git

   ```text
   API_KEY=YOUR_FTX_API_KEY
   API_SECRET=YOUR_FTX_API_SECRET
   ```

2. configure portfolio and order parameters in `parameters.js`, check out that file for more details.

3. run `npm start`, the bot will start placing orders but only one time.

### How to run it automatically at specific time or in specific intervals

This project will deploy a cronjob service running on AWS Lambda & EventBridge to execute our investment script regularly by using [Serverless Framework](https://www.serverless.com/).

1. [setup your Serverless Framework & AWS account](https://www.serverless.com/framework/docs/getting-started)

2. configure your FTX api secrets in [Serverless Dashboard parameters](https://www.serverless.com/framework/docs/guides/parameters#serverless-dashboard-parameters).

3. configure order parameters in `parameters.js`.

4. configure event scheduler in `serverless.yml` for configuring functions to be executed at specific time or in specific intervals.

   example:

   ```yml
   events:
     - schedule:
         rate: cron(0 0 ? * SAT *) # Invoke Lambda function every Saturday at 00:00:00 GMT
         enabled: true # set to false then re-deploy if you want to pause the bot
   ```

   Detailed information about cron expressions is available in official [AWS docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions).

5. run `npm run deploy` to do deployment, you are all set!

## FAQ

1. How to update order parameters after deploy?

   update `parameters.js` then run `npm run deploy` to redeploy.

2. How to update FTX secretes?

   update it on serverless dashboard then redeploy.

3. How to pause service on AWS?

   disable event scheduler by updating `serverless.yml` then redeploy.

4. How to remove service on AWS?

   ```shell
   npm run remove
   ```

> ## Disclaimer
>
> No Investment Advice & Do Your Own Research
