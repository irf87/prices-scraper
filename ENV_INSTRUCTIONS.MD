# Environment Variables Configuration

This document explains the environment variables used in the Price Scraper application.

## Server Configuration
- `_PORT`: The port number where the server will run (default: 8082)
- `_IS_DEBUG`: Enable/disable debug mode (true/false)

## Notification Settings
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token for notifications
- `TELEGRAM_BOT_CHAT_ID`: Your Telegram chat ID to receive notifications
- `ENABLE_NOTIFICATIONS`: Enable/disable notifications (true/false)

## Scraper Configuration
- `TIMEOUT_ANALIZER`: Timeout in milliseconds for DOM analysis (default: 10000)
- `SCRAPPER_INTERVAL`: Time interval between scraping operations
- `SCRAPPER_INTERVAL_UNIT`: Unit for the interval (e.g., "hours", "minutes")

## How to Configure

1. Copy the `env` file to `.env` in the root directory
2. Update the values according to your needs
3. Make sure to set your Telegram bot token and chat ID for notifications
4. Adjust the scraper interval based on your requirements

## Example Configuration
```env
_PORT="8082"
_IS_DEBUG="false"

# NOTIFICATIONS CONFIG
TELEGRAM_BOT_TOKEN="your_bot_token_here"
TELEGRAM_BOT_CHAT_ID="your_chat_id_here"
ENABLE_NOTIFICATIONS=true

# SCRAPER CONFIG
TIMEOUT_ANALIZER=10000
SCRAPPER_INTERVAL=4
SCRAPPER_INTERVAL_UNIT="hours"
```
