#!/data/data/com.termux/files/usr/bin/bash
# MAYA QUEEN AI — STATUS CHECK
PID_FILE="data/server.pid"
PORT=${PORT:-8080}

echo "=========================================================="
echo "          MAYA QUEEN SERVER STATUS REPORT                 "
echo "=========================================================="
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "Status:          RUNNING (PID: $PID)"
        echo "Endpoint:        http://127.0.0.1:$PORT"
        HEALTH=$(curl -s "http://127.0.0.1:$PORT/api/health" 2>/dev/null || true)
        if [ -n "$HEALTH" ]; then
            echo "API Health:      200 OK (Healthy)"
            echo "Probe Payload:   $HEALTH"
        else
            echo "API Health:      UNRESPONSIVE"
        fi
    else
        echo "Status:          STOPPED (Stale PID file)"
    fi
else
    echo "Status:          STOPPED (No active process)"
fi
echo "=========================================================="
