#!/data/data/com.termux/files/usr/bin/bash
# MAYA QUEEN AI — HEALTH CHECK PROBE
PORT=${PORT:-8080}
URL="http://127.0.0.1:$PORT"

echo "[*] Querying Maya Queen health endpoint at $URL/api/health..."
RES=$(curl -s -w "\n%{http_code}" "$URL/api/health" 2>/dev/null || true)
HTTP_CODE=$(echo "$RES" | tail -n1)
BODY=$(echo "$RES" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "[✓] Health check PASSED: HTTP 200 OK"
    echo "$BODY"
    exit 0
else
    echo "[!] Health check FAILED: HTTP $HTTP_CODE"
    echo "Is the server running? Start via ./start.sh"
    exit 1
fi
