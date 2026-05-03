#!/bin/bash

# ANSI Color Codes
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

APP_PORT=${1:-3000}

# Range validation
if [ "$APP_PORT" -lt 1024 ] || [ "$APP_PORT" -gt 65535 ]; then
    echo -e "${RED}Error: Port must be between 1024 and 65535.${NC}"
    exit 1
fi

# Port check (using ss or netstat)
if ss -tuln | grep -q ":$APP_PORT "; then
    echo -e "${RED}Error: Port $APP_PORT is already in use!${NC}"
    exit 1
fi

echo -e "${CYAN}Preparing to launch simplified_stock_market on port $APP_PORT...${NC}"

export APP_PORT=$APP_PORT
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit

INSTANCE_FILE="$SCRIPT_DIR/instance_count"

# Validation Logic
if [ -f "$INSTANCE_FILE" ]; then
    if [ ! -s "$INSTANCE_FILE" ]; then
        echo -e "${YELLOW}The file is empty.${NC}"
        echo "1" > "$INSTANCE_FILE"
        COUNT=0
    else
        RAW_CONTENT=$(cat "$INSTANCE_FILE" | tr -d '[:space:]')
        if [[ "$RAW_CONTENT" =~ ^[0-9]+$ ]]; then
            if [ "$RAW_CONTENT" -ne 0 ]; then
                echo -e "${RED}Error: instance_count suggests instances are alive. Run cleanup.sh first.${NC}"
                exit 1
            else
                echo "1" > "$INSTANCE_FILE"
                COUNT=0
            fi
        else
            echo -e "${RED}Invalid content. Assuming first instance.${NC}"
            echo "1" > "$INSTANCE_FILE"
            COUNT=0
        fi
    fi
else
    echo "1" > "$INSTANCE_FILE"
    COUNT=0
fi

echo -e "${CYAN}Script starting from directory: ${NC}$(pwd)"

DOCKER_NAME="simplified_stock_market_$COUNT"
docker-compose -p "$DOCKER_NAME" up -d --build