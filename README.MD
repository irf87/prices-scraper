# INSTRUCTIONS TO USE PRICES SCRAPER

1. Important after use this project, copy the database in the path **/database/price_scraper.db** into root project path.

2. Make a copy of file **env** and rename it by **.env**

3. You need sqlite installed in your system. [Official download page](https://www.sqlite.org/download.html)

    In linux just run a command to install it
    ```
    sudo apt install sqlite3
    ```
4. You need [ravendb](https://ravendb.net/download)
It soports arm64 for raspberry pi or orange pi

5. You need playwright

    ```
    npx playwright install
    ```


## Create your bot in telegram
To receive notifications about product changes, you need to create a bot.

1. You need to create a telegram bot token and set it in the file .env **TELEGRAM_BOT_TOKEN**

[Link To create a BOT token](https://github.com/yagop/node-telegram-bot-api/blob/master/doc/tutorials.md)

2. Also you need a CHAT ID, before you start with your BOT, send whatever message, then go to this URL, replece with your telegram token

(https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates)

In the response find the **chat.id** and set it in **TELEGRAM_BOT_CHAT_ID** inside your .env file

## Run the project

USE YARN insted of NPM

It's divided by 2 important files

- server.js there is an app client for the server [PRICE SCRAPER APP](https://github.com/irf87/price-scraper-app)
- scraper.js

### server.js

It's the api run with node/nodemon/pm2:

```
node server.js
```

In there you can add products, rules and the page where the program scrapes

### scaper.js

It's the core, you can run at once and set the interval in the env file with the property SCRAPPER_INTERVAL_TIME, if match with you rules it send you a notification in your telegram bot.

## Show documentation

```
<HOST>/api-docs
```

For example if the value _PORT of env file is 8080, the url to see the documentation should be:

```
<HOST>/api-docs
```
