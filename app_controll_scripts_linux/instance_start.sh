#!/bin/bash

# ANSI Color Codes
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

APP_PORT=${1:-3000}

if [ "$APP_PORT" -lt 1024 ] || [ "$APP_PORT" -gt 65535 ]; then
    echo -e "${RED}Error: Port must be between 1024 and 65535.${NC}"
    exit 1
fi

# Port check (using lsof for macOS/Linux compatibility)
if lsof -Pi :$APP_PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${RED}Error: Port $APP_PORT is already in use!${NC}"
    exit 1
fi

echo -e "${CYAN}Preparing to launch simplified_stock_market on port $APP_PORT...${NC}"

export APP_PORT=$APP_PORT
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit

INSTANCE_FILE="$SCRIPT_DIR/instance_count"

if [ -f "$INSTANCE_FILE" ] && [ -s "$INSTANCE_FILE" ]; then
    COUNT=$(cat "$INSTANCE_FILE" | tr -d '[:space:]')
    if [[ "$COUNT" =~ ^[0-9]+$ ]] && [ "$COUNT" -gt 0 ]; then
        NEW_COUNT=$((COUNT + 1))
        echo "$NEW_COUNT" > "$INSTANCE_FILE"
    else
        echo -e "${RED}No instances alive. Run first_start.sh first.${NC}"
        exit 1
    fi
else
    echo -e "${RED}File missing or empty. Run first_start.sh first.${NC}"
    exit 1
fi

echo -e "${CYAN}Script starting from directory: ${NC}$(pwd)"

# Using the previous count for naming to match PS1 logic
DOCKER_NAME="simplified_stock_market_$COUNT"
docker-compose -p "$DOCKER_NAME" -f compose.app.instance.yaml up -d --build
