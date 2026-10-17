#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# MAYA QUEEN AI — TERMUX INSTALLATION SCRIPT
# Tested on Android 10+ with Termux (ARM64 / ARMv7 / x86_64)
# ==============================================================================
set -e

echo "=========================================================="
echo "    MAYA QUEEN AI — TERMUX INSTALLATION & SETUP           "
echo "=========================================================="

# 1. Environment Verification
if [ -d "/data/data/com.termux/files/usr" ]; then
    echo "[✓] Environment: Verified Android Termux"
    PREFIX="/data/data/com.termux/files/usr"
else
    echo "[!] Notice: Running in standard Linux environment"
    PREFIX="/usr"
fi

ARCH=$(uname -m)
echo "[✓] Architecture: $ARCH"

# 2. Package Installation
echo ""
echo "[*] Checking required packages (nodejs, git, curl)..."
if command -v pkg >/dev/null 2>&1; then
    pkg update -y || true
    pkg install -y nodejs git curl || true
elif command -v apt-get >/dev/null 2>&1; then
    apt-get update -y || true
    apt-get install -y nodejs git curl npm || true
fi

# 3. Setup Directories
mkdir -p data logs workspace backups

# 4. Install Dependencies
if [ -f "package.json" ]; then
    echo "[*] Installing Node dependencies..."
    npm install --production || npm install
fi

# 5. Generate secure config if absent
if [ ! -f "data/config.json" ]; then
    echo "[*] Generating initial config with random secure auth token..."
    RAND_TOKEN="maya_$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16 2>/dev/null || echo 'sec_token_8892')"
    cat <<EOF > data/config.json
{
  "authToken": "$RAND_TOKEN",
  "localAiUrl": "http://127.0.0.1:11434",
  "activeModel": "gemini-3.8-flash",
  "activeEngine": "builtin",
  "defaultLanguage": "en",
  "audioLanguage": "hi"
}
EOF
    echo "[✓] Configuration generated in data/config.json"
fi

chmod +x *.sh 2>/dev/null || true

echo ""
echo "=========================================================="
echo "   [✓] MAYA QUEEN SERVER INSTALLED SUCCESSFULLY!          "
echo "=========================================================="
echo "To start the server:       ./start.sh"
echo "To check server status:    ./status.sh"
echo "To view live logs:         ./logs.sh"
echo "To run health probe:       ./healthcheck.sh"
echo "=========================================================="
