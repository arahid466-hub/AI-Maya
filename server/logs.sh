#!/data/data/com.termux/files/usr/bin/bash
# MAYA QUEEN AI — LIVE LOG VIEWER
LOG_FILE="logs/server.log"

if [ ! -f "$LOG_FILE" ]; then
    echo "[!] Log file $LOG_FILE does not exist yet."
    exit 0
fi

LINES=${1:-40}
echo "[*] Showing last $LINES lines of Maya Queen server logs (Ctrl+C to exit):"
echo "------------------------------------------------------------------"
tail -n "$LINES" -f "$LOG_FILE"
