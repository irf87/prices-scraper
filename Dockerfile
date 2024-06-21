# Node version
FROM node:20

# Mongo
FROM mongo

# Main dir
WORKDIR /app

# Instala SQLite
RUN apt-get update && apt-get install -y sqlite3

COPY . .

RUN apt-get install -y npm

RUN npm install --global yarn

FROM node:20

RUN node --version
RUN npm --version

# Instala las dependencias
RUN yarn install

# PORT FOR API
EXPOSE 8082

# PORT FOR MONGO
EXPOSE 27017

CMD ["yarn", "start:server"]