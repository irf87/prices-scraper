# Use Node.js 18 as the base image (more stable with current dependencies)
FROM node:18

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN rm -rf node_modules yarn.lock && yarn install

# Install specific versions of problematic dependencies
RUN yarn add parse5@6.0.1 entities@4.5.0

# Install Playwright browsers
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN yarn playwright install chromium

# Install better-sqlite3 with specific build flags
ENV CFLAGS="-DSQLITE_ENABLE_JSON1 -DSQLITE_ENABLE_FTS5"
RUN yarn add better-sqlite3@^8.0.0

# Copy the rest of the application
COPY . .

# Create startup script that handles default port
RUN echo '#!/bin/sh\n\
if [ -z "$_PORT" ]; then\n\
    export _PORT=8082\n\
fi\n\
node server.js & node --expose-gc scraper.js' > /app/start.sh && \
    chmod +x /app/start.sh

# Set environment variables with defaults
ENV _PORT=${_PORT:-8082}
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV DOCKER=true

# Expose the API port
EXPOSE ${_PORT:-8082}

# Start the server
CMD ["/app/start.sh"]