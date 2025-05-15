# Price Scraper

A powerful web scraping tool for tracking product prices with Telegram notifications.

## Client Application

This project has a companion mobile application built with React Native. You can find it at [Price Scraper App](https://github.com/irf87/price-scraper-app).

## Prerequisites

- Node.js v18.0.0 or higher
- SQLite installed on your system
- Node.js and Yarn package manager
- Playwright for web scraping

## Script Permissions

Before running any of the scripts, you need to make them executable. Run the following command in your terminal:

```bash
chmod +x setup-docker.sh update-docker.sh backup-db.sh restore-db.sh
```

This command will:
- Make all Docker-related scripts executable
- Allow you to run them using `./script-name.sh`
- Ensure proper execution of the scripts

> **Note:**  
> If you get a "Permission denied" error when trying to run a script,  
> make sure you've applied the permissions using the command above.

## Installation

1. **Install Dependencies**
   ```bash
   yarn install
   ```
   > **Note:** While `npm install` can also be used, we recommend using Yarn for better dependency management and faster installation.

2. **Database Setup**
   - Copy the database from `/database/price_scraper.db` to the project root directory

3. **Environment Configuration**
   - Copy the `env` file and rename it to `.env`
   - See [Environment Variables Guide](ENV_INSTRUCTIONS.MD) for detailed configuration

4. **SQLite Installation**
   - **Linux**: `sudo apt install sqlite3`
   - **macOS**: Check if installed with `sqlite3 --version`
   - [Official SQLite Download Page](https://www.sqlite.org/download.html)

5. **Playwright Installation**
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

3. Test Telegram Configuration:
   - Open: http://{localhost}:{8082}/api/test/telegram
   - This will verify if your Telegram bot is properly configured

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

## Building and Running the Docker Image

To build and run the project in Docker, simply use the provided script:

```sh
./setup-docker.sh
```

This script will:
- Ask you for the architecture (ARM64, AMD64, or both).
- Build the Docker image.
- Start the container with the correct port mapping.
- Copy the database file into the container.

After running the script, you can access the API at [http://localhost:8082](http://localhost:8082).

> **Note:**  
> You no longer need to run `docker buildx build`, `docker run`, or manually copy the database file.  
> The script handles everything for you.

## Database Management with Docker

The application uses Docker volumes to persist the database data. This is crucial for maintaining your data between container restarts and updates.

### Important Database Management Scripts

1. **Setup Docker Environment** (`setup-docker.sh`):
   ```bash
   ./setup-docker.sh
   ```
   - Creates a Docker volume for the database
   - Builds and starts the container
   - Initializes the database if it's the first run
   - Sets up the complete Docker environment

2. **Update Application** (`update-docker.sh`):
   ```bash
   ./update-docker.sh
   ```
   - Automatically creates a backup before updating
   - Pulls latest changes from git
   - Rebuilds the container
   - Preserves the database volume
   - **IMPORTANT**: Always use this script for updates instead of manual commands

3. **Backup Database** (`backup-db.sh`):
   ```bash
   ./backup-db.sh
   ```
   - Creates a timestamped backup of your database
   - Stores backups in the `./backups` directory
   - Automatically keeps only the last 5 backups
   - **IMPORTANT**: Run this before any major updates or container rebuilds

4. **Restore Database** (`restore-db.sh`):
   ```bash
   ./restore-db.sh ./backups/db-backup-YYYYMMDD-HHMMSS.tar.gz
   ```
   - Restores a specific backup
   - Automatically handles container restart
   - Use this if you need to recover from a backup

### Best Practices for Database Management

1. **Regular Backups**
   - Make regular backups of your database
   - Store backups in a safe location
   - Consider automating backups with cron jobs

2. **Before Updates**
   - Always create a backup before updating the container
   - Use `./backup-db.sh` to ensure data safety

3. **Volume Management**
   - The database is stored in a Docker volume named `price-scraper-db`
   - Never delete this volume unless you have a backup
   - Use `docker volume ls` to verify the volume exists

4. **Troubleshooting**
   If you encounter database issues:
   1. Check if the volume exists: `docker volume ls | grep price-scraper-db`
   2. Verify container status: `docker ps | grep price-scraper`
   3. Check container logs: `docker logs price-scraper`
   4. Restore from backup if necessary

### Common Commands

```bash
# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect price-scraper-db

# Remove volume (CAUTION: only if you have a backup)
docker volume rm price-scraper-db

# View container logs
docker logs price-scraper
```

> **WARNING:**  
> Never delete the Docker volume without having a backup.  
> Always run `./backup-db.sh` before any major changes to the container.

## Testing the Application

After starting the container, you can test if it's working by visiting these URLs in your web browser:

1. API Documentation:
   - Open: http://localhost:8082/api-docs/#/Products
   - This shows all available API endpoints

2. Test Endpoint:
   - Open: http://localhost:8082/api/test/
   - You should see "Server is working!"


## Important Notes

- The scraper runs automatically inside the container - you don't need to start it manually
- The application uses port 8082 - make sure this port is free on your computer
- The API documentation is available at http://localhost:8082/api-docs
- All data is stored in a SQLite database inside a Docker volume
- Always use the `--env-file .env` flag when running the container to ensure all environment variables are loaded
- Remember to rebuild the container after pulling new changes from the repository
- Make regular backups of your database volume

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
