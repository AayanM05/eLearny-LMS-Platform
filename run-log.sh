#!/usr/bin/env bash
# Bash logging wrapper script for eLearny monorepo

if [ $# -eq 0 ]; then
    echo "Usage: ./run-log.sh <command> [args...]"
    echo "Example: ./run-log.sh mvn test"
    exit 1
fi

FULL_CMD="$*"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%m-%s")
SAN_CMD=$(echo "$FULL_CMD" | sed 's/[^a-zA-Z0-9\-_]/_/g' | cut -c1-40)

LOG_DIR="$(dirname "$0")/logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/${TIMESTAMP}_${SAN_CMD}.log"

echo "================================================================================" > "$LOG_FILE"
echo "COMMAND LOG RECORD" >> "$LOG_FILE"
echo "Command          : $FULL_CMD" >> "$LOG_FILE"
echo "Execution Time   : $(date)" >> "$LOG_FILE"
echo "================================================================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo -e "\n🚀 Executing command with live logging..."
echo -e "📝 Logging output to: logs/$(basename "$LOG_FILE")\n"

# Run command and write output to terminal and log file simultaneously
eval "$FULL_CMD" 2>&1 | tee -a "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}

echo "" >> "$LOG_FILE"
echo "================================================================================" >> "$LOG_FILE"
echo "Exit Code        : $EXIT_CODE" >> "$LOG_FILE"
echo "Completed At     : $(date)" >> "$LOG_FILE"
echo "================================================================================" >> "$LOG_FILE"

exit $EXIT_CODE
