#!/data/data/com.termux/files/usr/bin/bash
# MAYA QUEEN AI — DATA BACKUP SCRIPT
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE="$BACKUP_DIR/maya_backup_$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"
echo "[*] Creating backup of Maya data directory..."

if [ -d "data" ]; then
    tar -czf "$ARCHIVE" data/
    echo "[✓] Backup created successfully: $ARCHIVE"
    ls -lh "$ARCHIVE"
else
    echo "[!] No data directory found to back up."
fi
