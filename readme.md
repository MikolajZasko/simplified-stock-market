# Simplified Stock Market
A simple stock market simulation using Node.js and TypeScript fully containerized using Docker.

## Quick Start
```bash
# clone the git repo
git clone https://github.com/MikolajZasko/simplified-stock-market.git

# navigate to root dir
cd simplified-stock-market

# start the app
docker compose up --build
```

The server will be running at http://localhost:3000 (this requires change)

## Tech Stack
 - Node.js
 - TypeScript
 - Docker
 - REST API

## Project Structure
```
├── src/
│   └── index.ts        # Entry point
├── Dockerfile          # Docker config
├── compose.yaml        # Starts the app
└── tsconfig.json       # TypeScript configuration
```

## development
```bash
# if run in the root dir it will await changes
npx nodemon --exec tsx src/index.ts
```
