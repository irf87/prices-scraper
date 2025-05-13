# Price Scraper

A powerful web scraping tool for tracking product prices with Telegram notifications.

## Client Application

This project has a companion mobile application built with React Native. You can find it at [Price Scraper App](https://github.com/irf87/price-scraper-app).

## Prerequisites

- SQLite installed on your system
- Node.js and Yarn package manager
- Playwright for web scraping

## Installation

1. **Database Setup**
   - Copy the database from `/database/price_scraper.db` to the project root directory

2. **Environment Configuration**
   - Copy the `env` file and rename it to `.env`
   - See [Environment Variables Guide](ENV_INSTRUCTIONS.MD) for detailed configuration

3. **SQLite Installation**
   - **Linux**: `sudo apt install sqlite3`
   - **macOS**: Check if installed with `sqlite3 --version`
   - [Official SQLite Download Page](https://www.sqlite.org/download.html)

4. **Playwright Installation**
   ```bash
   npx playwright install
   ```

## Telegram Bot Setup

1. Create a Telegram bot to receive notifications:
   - Get your bot token from [Telegram Bot API](https://github.com/yagop/node-telegram-bot-api/blob/master/doc/tutorials.md)
   - Set the token in `.env` as `TELEGRAM_BOT_TOKEN`

2. Get your Chat ID:
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates`
   - Find your `chat.id` in the response
   - Set it in `.env` as `TELEGRAM_BOT_CHAT_ID`

## Running the Application

The application consists of two main components:

### 1. API Server (server.js)
```bash
node server.js
```
- Manages products, rules, and scraping configurations
- Access API documentation at `http://localhost:{PORT}/api-docs`

### 2. Scraper (scraper.js)
```bash
node --expose-gc scraper.js
```
- Core scraping functionality
- Runs at intervals specified in `.env`
- Sends notifications via Telegram when price changes are detected

## API Documentation

Access the API documentation at:
```
http://localhost:{PORT}/api-docs
```
Replace `{PORT}` with your configured port number (default: 8082).
