#!/bin/bash

# ANSI Color Codes
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Get the script's directory and move to parent
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit

# Path to instance_count file
INSTANCE_FILE="$SCRIPT_DIR/instance_count"

# Reset instance count to 0
echo "0" > "$INSTANCE_FILE"

# Handle flags
CLEAN_DOCKER=false
while getopts "c" opt; do
  case $opt in
    c) CLEAN_DOCKER=true ;;
    *) ;;
  esac
done

if [ "$CLEAN_DOCKER" = true ]; then
    CONTAINER_IDS=$(docker ps -aq)
    if [ -n "$CONTAINER_IDS" ]; then
        echo -e "${CYAN}Cleaning up containers...${NC}"
        docker rm -f $CONTAINER_IDS
    else
        echo -e "${GRAY}No containers found to clean up.${NC}"
    fi
else
    echo -e "${GRAY}Skipping Docker cleanup (use -c to enable).${NC}"
fi