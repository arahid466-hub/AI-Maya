#!/data/data/com.termux/files/usr/bin/bash
# MAYA QUEEN AI — START SERVER
PID_FILE="data/server.pid"
LOG_FILE="logs/server.log"
PORT=${PORT:-8080}

mkdir -p data logs

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "[!] Maya Queen server is already running with PID $PID."
        echo "    Endpoint: http://127.0.0.1:$PORT"
        exit 0
    else
        rm -f "$PID_FILE"
    fi
fi

echo "[*] Starting Maya Queen Server on port $PORT..."
nohup node server.js >> "$LOG_FILE" 2>&1 &
NEW_PID=$!
echo $NEW_PID > "$PID_FILE"
sleep 1

if kill -0 "$NEW_PID" 2>/dev/null; then
    echo "[✓] Maya Queen Server started successfully (PID: $NEW_PID)!"
    echo "    Local Endpoint: http://127.0.0.1:$PORT"
    echo "    Check logs:     ./logs.sh"
else
    echo "[!] Error: Server failed to start. Last log lines:"
    tail -n 15 "$LOG_FILE" 2>/dev/null || true
    exit 1
fi
