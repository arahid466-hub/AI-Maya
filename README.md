# MAYA QUEEN AI — Personal Desktop & Android AI Assistant (v2.0 Repaired)

Maya Queen is a high-intelligence, private personal AI assistant designed for Desktop and Android. It pairs a **native Kotlin & Jetpack Compose Android application** with a **local Termux Node.js server**, featuring natural sweet female Hindi voice audio, English text chat, live web search, smart home automation, reminders, and strict banking protection.

---

## 1. Key Architectural Principles

1. **Mandatory Language Division**:
   - **Written Interface & Chat**: 100% English only across all screens, buttons, navigation items, notifications, settings, and generated text responses.
   - **Voice & Audio**: 100% sweet, natural female Hindi speech synthesis (`hi-IN`).
   - **Bilingual Pipeline**: English reasoning answer → Hindi speech translation → Hindi TTS playback.
2. **Design Direction — Maya Queen**:
   - Dark black/navy background (`#07070B`), restrained crimson neon accents (`#E11D48`), and gold details (`#F59E0B`).
   - High-contrast, clean typography with separate Voice Interaction Screen and English Chat Screen.
3. **Smart Home Automation Mesh**:
   - Real-time device state management for ceiling lights, ambient mood RGB, AC thermostat, 4K smart TV, front entrance deadbolt, and coffee maker.
   - Autonomous scene presets: *"Movie Night"*, *"Good Morning"*, *"Sleep Mode"*, *"All Off"*.
4. **Reminders & Countdown Timers**:
   - Interactive scheduling with priority tags (Work, Health, Home, Personal) and audible countdown timers.
5. **Live Web Search & Verified URLs**:
   - Genuine search integration via DuckDuckGo and OpenSearch with authentic source links.
6. **Strict Financial Security Guard**:
   - Permanent hard block on Google Pay, PhonePe, Paytm, and net banking operations.

---

## 2. Deliverables & Packages

| Package | Location | Checksum (SHA-256) |
|---|---|---|
| **Maya Termux Server** | `public/downloads/MAYA-TERMUX-SERVER.zip` | `4b0bcbe9343b77e9ae14837e4f0b09f592895659f75223be71f5b54f07d3617b` |
| **Maya Android Source** | `public/downloads/MAYA-ANDROID-APK-SOURCE.zip` | `39e5396d6230b3ffbfff2a8012a3322b24b9323fe7dcf4dbc8b07e4c0fd4552b` |

*Note: The previous archive's fake APK (which was a renamed source ZIP) has been removed. Genuine APK compilation instructions are provided below.*

---

## 3. How to Set Up & Run Termux Server on Android

```bash
# 1. Update Termux repositories & install packages
pkg update -y && pkg install -y nodejs git curl unzip

# 2. Extract Maya Server Archive
mkdir -p ~/maya-server && cd ~/maya-server
unzip /sdcard/Download/MAYA-TERMUX-SERVER.zip
chmod +x *.sh

# 3. Install Node.js dependencies
./install.sh

# 4. Start Maya Queen Server
./start.sh

# 5. Verify server health
./healthcheck.sh
```

- **Local Endpoint**: `http://127.0.0.1:8080`
- **View Live Logs**: `./logs.sh`
- **Stop Server**: `./stop.sh`

---

## 4. How to Build the Android APK

### In Android Studio (Ladybug 2024.2+)
1. Unzip `MAYA-ANDROID-APK-SOURCE.zip`.
2. Open the project folder in Android Studio.
3. Select **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

### In Android Termux (On-Device)
```bash
pkg install -y openjdk-17 gradle git
cd ~/maya-queen-android
gradle assembleDebug
# Generated APK: app/build/outputs/apk/debug/app-debug.apk
```

---

## 5. Security & Verification Audit

Complete defect reports and verification matrices are available in:
- `docs/INVENTORY-AND-AUDIT.md` (Stage A Report)
- `docs/DEFECT-LIST.md` (Stage B Defect Catalog)
- `docs/AUDIT-AND-SECURITY-FINDINGS.md` (Remediation Report)
- `docs/FEATURE-VERIFICATION-MATRIX.md` (12/12 Automated Tests Passed)
