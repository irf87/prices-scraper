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

# Price Scraper Docker Guide

This guide explains how to build and run the Price Scraper application using Docker on different computer types.

## Environment Variables

The application needs environment variables to work properly. These variables are stored in a `.env` file. Make sure to create this file before running the container.

### Important Note about .env
- The `.env` file is crucial for the application to work correctly
- Never commit the `.env` file to git (it should be in .gitignore)
- Keep a `.env.example` file in the repository as a template
- For detailed environment configuration, see [Environment Variables Guide](ENV_INSTRUCTIONS.MD)

## Building the Docker Image

### For Mac with M1, M2, M3, or M4 chip (ARM64)
```bash
docker buildx build --platform linux/arm64 -t prices-scraper .
```

### For Linux or Windows with Intel/AMD processor (x86_64)
```bash
docker buildx build --platform linux/amd64 -t prices-scraper .
```

### For building both versions at once
```bash
docker buildx build --platform linux/arm64,linux/amd64 -t prices-scraper .
```

## Running the Container

To run the container with environment variables from .env file:
```bash
docker run --env-file .env -p 8082:8082 prices-scraper
```

## Testing the Application

After starting the container, you can test if it's working by visiting these URLs in your web browser:

1. API Documentation:
   - Open: http://localhost:8082/api-docs/#/Products
   - This shows all available API endpoints

2. Test Endpoint:
   - Open: http://localhost:8082/test/
   - You should see "Server is working!"

## Important Notes

- The scraper runs automatically inside the container - you don't need to start it manually
- The application uses port 8082 - make sure this port is free on your computer
- The API documentation is available at http://localhost:8082/api-docs
- All data is stored in a SQLite database inside the container
- Always use the `--env-file .env` flag when running the container to ensure all environment variables are loaded

## Troubleshooting

If you can't access the application:
1. Check if the container is running: `docker ps`
2. Make sure port 8082 is not used by another application
3. Verify that your `.env` file exists and has the correct variables
4. Try stopping and removing the container:
   ```bash
   docker stop $(docker ps -q)
   docker rm $(docker ps -aq)
   ```
   Then start it again with the run command above.
