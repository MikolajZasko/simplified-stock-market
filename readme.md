# Simplified Stock Market

A simple stock market simulation using Node.js and TypeScript fully containerized using Docker.

## Quick Start

```bash
# firstly, make sure you have docker desktop downloaded and running!
# https://www.docker.com/products/docker-desktop/
#
# clone the git repo
git clone https://github.com/MikolajZasko/simplified-stock-market.git

# navigate to root dir
cd simplified-stock-market

# start the app in production mode - no nodemon and no volumes - fast and compiled
docker-compose up -d --build

# if you want to look into the database using a local machine
# use the drizzle.config_local.ts like so:
npx drizzle-kit studio --config=src/db/drizzle_configs/drizzle.config_local.ts
```

The server will be running at http://localhost:3000 (this requires change) \
The postgres database will be running at http://localhost:5432 \
If started, drizzle will be running at https://local.drizzle.studio/ (kinda like a phpmyadmin for sql) \

## Tech Stack

- ### Back-end
  - Node.js
  - TypeScript
  - drizzle
  - postgresql
  - Docker
  - REST API
- ### Front-end
  - handlebars
  - bootstrap

## Project Structure

```
├── src/
│   └── index.ts        # App logic / Entry point
├── Dockerfile          # Docker config
├── compose.yaml        # Starts the app
└── tsconfig.json       # TypeScript configuration
```

## development

```bash
# start the app in development mode - docker volumes + nodemon for
# server side updates
docker-compose -f compose.yaml -f compose.dev.yaml up -d --build

# if you want to look into the database using a local machine
# use the drizzle.config_local.ts like so:
npx drizzle-kit studio --config=src/db/drizzle_configs/drizzle.config_local.ts

# stop the app in development mode
docker-compose -f compose.yaml -f compose.dev.yaml down
```
