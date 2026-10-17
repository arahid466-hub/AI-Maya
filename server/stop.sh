#!/data/data/com.termux/files/usr/bin/bash
# MAYA QUEEN AI — STOP SERVER
PID_FILE="data/server.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "[!] No running Maya Queen server PID file found."
    exit 0
fi

PID=$(cat "$PID_FILE")
if kill -0 "$PID" 2>/dev/null; then
    echo "[*] Stopping Maya Queen Server (PID: $PID)..."
    kill "$PID" 2>/dev/null || true
    for i in {1..5}; do
        if ! kill -0 "$PID" 2>/dev/null; then
            break
        fi
        sleep 1
    done
    if kill -0 "$PID" 2>/dev/null; then
        kill -9 "$PID" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
    echo "[✓] Maya Queen Server stopped cleanly."
else
    echo "[!] Process $PID was not active. Cleaning stale PID file."
    rm -f "$PID_FILE"
fi
