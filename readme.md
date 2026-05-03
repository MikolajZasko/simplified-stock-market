# Simplified Stock Market

A simple stock market simulation using Node.js and TypeScript fully containerized using Docker.

## Windows

### Quick Start

```ps1
# firstly, make sure you have docker desktop downloaded and running!
# https://www.docker.com/products/docker-desktop/
#
# clone the git repo
git clone https://github.com/MikolajZasko/simplified-stock-market.git

# navigate to root dir
cd simplified-stock-market

# start the app in production mode - no nodemon and no volumes - fast and compiled
# change the port number if needed
./app_controll_scripts_windows/first_start.ps1 3000
```

The server will be running at http://localhost:XXXX \
The postgres database will be running at http://localhost:5432 \

### how to monitor the db?

```ps1
# if you want to look into the database using a local machine
# use the drizzle.config_local.ts like so:
npx drizzle-kit studio --config=src/db/drizzle_configs/drizzle.config_local.ts
```

If started, drizzle will be running at https://local.drizzle.studio/ (kinda like a phpmyadmin for sql)

### how to run another instance?

```ps1
# use the script only when first_start.ps1 was run and has finished
# change the port number if needed
./app_controll_scripts_windows/instance_start.ps1 3000
```

### how to clean docker?

```ps1
# !!! WARNING - THIS SCRIPT CAN DESTROY ALL LOCAL DOCKER CONTAINERS USE WITH CAUTION !!!
#
# leave docker containers alone - clean just the instance_count file
./app_controll_scripts_windows/cleanup.ps1

# DESTROY ALL LOCAL DOCKER CONTAINERS
./app_controll_scripts_windows/cleanup.ps1 -c
```

## Linux

### Quick Start

```bash
# firstly, make sure you have docker desktop downloaded and running!
# https://www.docker.com/products/docker-desktop/
#
# clone the git repo
git clone https://github.com/MikolajZasko/simplified-stock-market.git

# navigate to root dir
cd simplified-stock-market

# start the app in production mode - no nodemon and no volumes - fast and compiled
# change the port number if needed
./app_controll_scripts_windows/first_start.sh 3000
```

The server will be running at http://localhost:XXXX \
The postgres database will be running at http://localhost:5432 \

### how to monitor the db?

```bash
# if you want to look into the database using a local machine
# use the drizzle.config_local.ts like so:
npx drizzle-kit studio --config=src/db/drizzle_configs/drizzle.config_local.ts
```

If started, drizzle will be running at https://local.drizzle.studio/ (kinda like a phpmyadmin for sql)

### how to run another instance?

```bash
# use the script only when first_start.sh was run and has finished
# change the port number if needed
./app_controll_scripts_windows/instance_start.sh 3000
```

### how to clean docker?

```bash
# !!! WARNING - THIS SCRIPT CAN DESTROY ALL LOCAL DOCKER CONTAINERS USE WITH CAUTION !!!
#
# leave docker containers alone - clean just the instance_count file
./app_controll_scripts_windows/cleanup.sh

# DESTROY ALL LOCAL DOCKER CONTAINERS
./app_controll_scripts_windows/cleanup.sh -c
```

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
