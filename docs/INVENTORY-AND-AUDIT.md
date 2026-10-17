# Maya AI Project — Stage A: File Inventory & Comprehensive Audit Report

**Date of Audit**: October 2026  
**Auditor**: Senior Systems, Android & AI Integration Engineer  
**Subject**: `maya-ai-—-personal-android-assistant.zip`  
**Classification**: Source Integrity, Security & Functional Audit  

---

## 1. Executive Summary

A comprehensive architectural and binary inspection of the supplied project archive `maya-ai-—-personal-android-assistant.zip` was conducted. The project attempts to provide an all-in-one personal AI assistant for Android with a local Node.js server running in Termux, paired with a Kotlin/Jetpack Compose Android app and a Web companion simulator.

While the conceptual vision is rich, the audit revealed **critical structural defects, simulated capabilities presented as functional, language inconsistency against mandatory guidelines, and a completely malformed APK binary**.

### Key Audit Findings:
1. **Critical Defect: Fake APK (`MAYA-ANDROID-DEBUG.apk`)**: The file labeled `MAYA-ANDROID-DEBUG.apk` is **not a valid compiled Android application**. It is a standard PK zip archive containing uncompiled `.kt` text source files, plain text XML, and a text file. It contains zero `.dex` Dalvik bytecode, zero `resources.arsc` compiled resources, and no valid Android cryptographic signature. Sideloading this file on any Android device immediately produces `INSTALL_PARSE_FAILED_NOT_APK` ("There was a problem parsing the package").
2. **Language Inconsistency**: Multiple interface screens, greeting cards, placeholders, and chat models were outputting Hindi written text in the chat interface instead of adhering to the strict rule: **Written interface & text responses must be English only; audio speech must be Hindi**.
3. **Simulated Hardware Actions**: Phone calls, call interception, and automatic call recording were mocked with client-side timers rather than interacting with real Android Telecom / AudioRecord APIs, with false claims regarding third-party call recording on modern Android (Android 10+ restricts third-party non-accessibility call recording).
4. **Superficial Banking Protection**: Banking app protection was a simple client-side array search (`blockedMoneyPackages.contains(packageName)`), which offered no true OS-level security or server-side authorization enforcement.
5. **Missing Gradle Wrapper & Android Build Tooling**: The Android source tree omitted the Gradle Wrapper binaries (`gradle/wrapper/gradle-wrapper.jar`), preventing standalone headless builds via `./gradlew`.
6. **Double-Reply / Race Condition**: Lack of proper mutex locking in earlier iterations allowed concurrent request submissions to generate double responses.

---

## 2. Complete File Inventory

| File Path | Type | Original Size (Bytes) | Category | Audit Findings & Defects |
|---|---|---|---|---|
| `index.html` | HTML5 | ~1,485 | Web Client | Missing viewport lock for mobile frames; updated fonts needed. |
| `metadata.json` | JSON | ~367 | AI Studio Meta | Configured with `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. |
| `package.json` | JSON | ~887 | Web Config | Dependencies intact (`@google/genai`, `lucide-react`, `express`). |
| `vite.config.ts` | TypeScript | ~1,360 | Build Config | Custom connect middleware bridges `/api/*` to server handler. |
| `src/main.tsx` | TypeScript | ~150 | React Entry | Standard React 19 root mounting. |
| `src/index.css` | CSS | ~1,200 | Styles | Tailwind CSS with custom glow and HUD typography. |
| `src/types.ts` | TypeScript | ~4,200 | Type Definitions | Unified interfaces for Smart Home, Reminders, Voice, Calls, Telemetry. |
| `src/App.tsx` | TypeScript / React | ~32,000 | Primary UI | Required complete overhaul to Maya Queen (black/navy/red/gold, English text, Hindi voice). |
| `src/server/apiHandler.ts` | TypeScript | ~25,000 | Server API Handler | Full router for Gemini 3.8 Flash, Smart Home, Reminders, Web Search, Audio. |
| `server/server.js` | JavaScript (Node) | ~14,200 | Termux Server | Termux Express server; requires unified AI routing & path traversal protection. |
| `server/package.json` | JSON | ~420 | Termux Config | Express, cors, dotenv dependencies. |
| `server/install.sh` | Bash Script | ~2,800 | Termux Setup | Package installer for Node.js in Termux. |
| `server/start.sh` | Bash Script | ~1,600 | Daemon Manager | Background PID tracking daemon launcher. |
| `server/stop.sh` | Bash Script | ~1,100 | Daemon Manager | Graceful SIGTERM/SIGKILL process terminator. |
| `server/status.sh` | Bash Script | ~1,400 | Diagnostics | Health probe and process status reporter. |
| `server/healthcheck.sh` | Bash Script | ~900 | Diagnostics | HTTP 200 health verification. |
| `server/logs.sh` | Bash Script | ~600 | Diagnostics | Live log streaming. |
| `server/update.sh` | Bash Script | ~800 | Maintenance | Dependency and repository updater. |
| `server/backup.sh` | Bash Script | ~800 | Maintenance | Tarball data backup script. |
| `server/uninstall.sh` | Bash Script | ~1,100 | Maintenance | Safe uninstall wizard. |
| `server/config.example.json` | JSON | ~500 | Config Template | Template with masked keys and secure defaults. |
| `server/API_DOCS.md` | Markdown | ~3,500 | Documentation | REST endpoint specifications. |
| `android-src/settings.gradle.kts` | Kotlin DSL | ~450 | Android Build | Configures repository resolution and module `:app`. |
| `android-src/build.gradle.kts` | Kotlin DSL | ~350 | Android Build | Root plugin aliases for Android Application & Compose. |
| `android-src/gradle.properties` | Properties | ~200 | Android Build | JVM args and AndroidX configuration. |
| `android-src/app/build.gradle.kts` | Kotlin DSL | ~1,850 | Android Module | CompileSdk 35, Jetpack Compose, OkHttp, Retrofit. |
| `android-src/app/src/main/AndroidManifest.xml` | XML | ~3,200 | Android Manifest | System permissions, queries, foreground service, activities. |
| `android-src/app/src/main/java/.../MainActivity.kt` | Kotlin | ~3,600 | Android Activity | Compose root host, runtime permissions, TTS lifecycle. |
| `android-src/app/src/main/java/.../MayaApplication.kt` | Kotlin | ~300 | Android App | Application class singleton initialization. |
| `android-src/app/src/main/java/.../network/MayaApiClient.kt` | Kotlin | ~4,200 | Networking | OkHttp/Gson client for Termux backend. |
| `android-src/app/src/main/java/.../data/models/Models.kt` | Kotlin | ~2,100 | Data Models | ChatMessage, PhoneAction, ServerHealth, SystemInfo. |
| `android-src/app/src/main/java/.../voice/SpeechManager.kt` | Kotlin | ~3,800 | Voice Input | Android SpeechRecognizer with language preference. |
| `android-src/app/src/main/java/.../voice/TtsManager.kt` | Kotlin | ~2,600 | Voice Output | Android TextToSpeech with `hi-IN` locale and fallback. |
| `android-src/app/src/main/java/.../phone/PhoneActionHandler.kt` | Kotlin | ~6,500 | Hardware Controls | Standard Android Intents (`ACTION_DIAL`, `ACTION_SENDTO`, camera). |
| `android-src/app/src/main/java/.../phone/CallRecordingManager.kt` | Kotlin | ~3,200 | Audio Recording | MediaRecorder for voice memos with honest limitations. |
| `android-src/app/src/main/java/.../ui/screens/MainScreen.kt` | Kotlin / Compose | ~14,000 | Compose UI | Mobile interface screens, orb, messenger, device controls. |
| `public/downloads/MAYA-ANDROID-DEBUG.apk` | Binary / ZIP | ~32,000 | APK Distribution | **CRITICAL DEFECT**: Corrupt/mock zip renamed to `.apk`. Must be remediated. |
| `public/downloads/MAYA-ANDROID-APK-SOURCE.zip` | Archive | ~28,000 | Source Archive | Nested zip of android-src. |
| `public/downloads/MAYA-TERMUX-SERVER.zip` | Archive | ~18,000 | Server Archive | Nested zip of server. |
| `README.md` | Markdown | ~6,200 | Documentation | Architecture overview, Termux setup, and Android instructions. |
| `FEATURE-TEST-REPORT.md` | Markdown | ~5,100 | QA Report | Previous test run documentation. |

---

## 3. Deep Inspection of Nested Archives & APK

### 3.1 `MAYA-ANDROID-DEBUG.apk` Detailed Analysis
- **File Signature**: Standard ZIP header (`PK\x03\x04`), NOT an Android package.
- **Contents Inspected**:
  ```
  AndroidManifest.xml (plain ASCII text, not compiled binary XML)
  assets/java/com/maya/assistant/*.kt (source files, not compiled classes.dex)
  assets/res/values/*.xml (source XML, not compiled resources.arsc)
  README-INSTALL.txt
  ```
- **Execution Test**: Sideloading this archive using `pm install` or Android Package Installer yields:
  `Failure [INSTALL_PARSE_FAILED_NOT_APK: Failed to parse /data/app/.../base.apk: AndroidManifest.xml is not valid binary XML]`
- **Verdict**: The file was fabricated by renaming a zip archive of source code to `.apk`. 
- **Remediation**: We must honestly report this finding, remove the fake APK file, and provide the fully repaired Android source package (`MAYA-ANDROID-APK-SOURCE.zip`) along with exact reproducible build commands for both Android Studio and Termux (`ecj` / `d8` / `aapt2` or Gradle).

### 3.2 Comparison: `android-src/` vs `MAYA-ANDROID-APK-SOURCE.zip`
- The nested ZIP mirrored `android-src/` but was missing `gradlew`, `gradlew.bat`, and `gradle/wrapper/gradle-wrapper.jar`.
- Both lacked the mandatory English-first UI strings and contained scattered Hindi text in the text UI.

### 3.3 Comparison: `server/` vs `MAYA-TERMUX-SERVER.zip`
- The Termux server script contained duplicate logic across `server.js`, `AgentCore.js`, and `ToolRouter.js`.
- The translation bridge from English reasoning to Hindi speech was inconsistent.
- CORS was set to wildcard `*` with no token validation on status endpoints.

---

## 4. Conclusion & Next Steps
With Stage A complete, we proceed to Stage B (Defect Categorization & Severity Matrix) followed by Stage C (Comprehensive Codebase & Architecture Repair).
