# Maya AI Project — Stage B: Detailed Defect List & Remediation Plan

**Audit Classification**: Architecture, Security, Build & Language Compliance  
**Auditor**: Senior Systems, Android & AI Integration Engineer  

---

## Defect Summary Matrix

| Defect ID | Category | Severity | File Path(s) | Description | Proposed Fix |
|---|---|---|---|---|---|
| **DEF-001** | Build / Binary | **CRITICAL** | `public/downloads/MAYA-ANDROID-DEBUG.apk` | File is a renamed ZIP of `.kt` source files, not a compiled APK with DEX bytecode. | Remove fraudulent APK file; package valid portable Android source with Gradle wrapper and reproducible build manual. |
| **DEF-002** | Language Policy | **HIGH** | `src/App.tsx`, `android-src/.../MainScreen.kt`, `src/types.ts` | Hindi text written in UI chat, greetings, and placeholders violating English-only text rule. | Enforce strict separation: 100% English written text interface; 100% sweet Hindi spoken voice via audio synthesis pipeline. |
| **DEF-003** | Android Telephony | **HIGH** | `server/server.js`, `android-src/.../CallRecordingManager.kt` | Unrealistic claims of third-party call answering and audio recording on modern Android without stating OS restrictions. | Document Android 10+ scoped storage & `InCallService` restrictions; replace with standard supported `ACTION_DIAL` and voice memo audio recording. |
| **DEF-004** | Security / Auth | **HIGH** | `server/server.js`, `src/server/apiHandler.ts`, `server/ToolRouter.js` | Banking security was a shallow string match; path traversal check in `ToolRouter.js` had potential edge cases. | Implement robust path traversal normalization (`path.relative`); enforce server-side token auth; lock all financial queries. |
| **DEF-005** | Build Tooling | **HIGH** | `android-src/` | Missing Gradle Wrapper binaries (`gradlew`, `gradle/wrapper/gradle-wrapper.properties`). | Generate full Gradle wrapper structure with Gradle 8.9 and AGP 8.7.0. |
| **DEF-006** | AI Routing | **MEDIUM** | `server/server.js`, `src/server/apiHandler.ts` | External providers had scattered endpoints with mock status; duplicate responses on rapid clicks. | Create single unified AI router supporting Ollama HTTP API, Google Gemini 3.8 Flash, Groq, and Maya Turbo with deduplication locks. |
| **DEF-007** | Voice Pipeline | **MEDIUM** | `src/App.tsx`, `android-src/.../TtsManager.kt` | English-to-Hindi translation lacked dedicated bilingual pipeline; translation failures not reported. | Build 3-stage pipeline: English AI answer → Contextual Hindi Translation → Hindi TTS Speech with speech controls (rate, pitch, stop). |
| **DEF-008** | Design & UI | **MEDIUM** | `src/App.tsx`, `src/index.css` | UI had mixed styling without coherent Maya Queen theme (dark navy/black, red neon accents, gold details). | Implement approved Maya Queen theme across desktop HUD, voice screen, and messenger screens. |
| **DEF-009** | Web Search | **MEDIUM** | `server/server.js`, `src/server/apiHandler.ts` | Search results lacked timeout safety and structured timestamp metadata. | Implement real DuckDuckGo search with 6s AbortController, domain extraction, and formatted link citations. |
| **DEF-010** | Smart Home | **LOW** | `src/types.ts`, `src/components/SmartHomeHubModal.tsx` | Smart Home actions lacked granular parameter validation (thermostat limits, hex color validation). | Implement clamped ranges (16°C-30°C), valid hex palettes, and discrete scene protocols. |

---

## Detailed Defect Analysis

### DEF-001: Fake APK Binary (`public/downloads/MAYA-ANDROID-DEBUG.apk`)
- **Evidence**: 
  ```bash
  unzip -l public/downloads/MAYA-ANDROID-DEBUG.apk
  # Archive: public/downloads/MAYA-ANDROID-DEBUG.apk
  # Length      Date    Time    Name
  # 3200        ...     ...     AndroidManifest.xml (plain ASCII)
  # 3600        ...     ...     assets/java/com/maya/assistant/MainActivity.kt
  # 0 bytes of .dex bytecode!
  ```
- **Severity**: **CRITICAL**
- **Impact**: Any user downloading this APK experiences immediate parse error on Android: `There was a problem parsing the package`.
- **Remediation**:
  1. Replace this misleading download with the verified clean Android source archive (`MAYA-ANDROID-APK-SOURCE.zip`).
  2. Provide clear, honest documentation explaining that Android Studio or Termux with `aapt2` / `d8` is required to compile DEX bytecode and sign the APK.

### DEF-002: Violation of Language Separation
- **Evidence**: The initial project displayed written Hindi sentences in the chat feed (e.g. `"नमस्ते! मैं माया हूँ..."`) alongside written English.
- **Severity**: **HIGH**
- **Impact**: Violates the mandatory instruction: **Written interface and chat: English only. Voice and audio: Hindi speech only.**
- **Remediation**:
  1. Update all UI text, headings, buttons, placeholder text, and system responses to crisp English.
  2. Implement an automated bilingual pipeline: The AI produces high-knowledge English text, and extracts a dedicated sweet Hindi translation specifically for the audio speech synthesis engine.

### DEF-003: Unsupported Android Call Interception Claims
- **Evidence**: `CallRecordingManager.kt` used `MediaRecorder.AudioSource.VOICE_COMMUNICATION` claiming automated background call recording for any incoming call.
- **Severity**: **HIGH**
- **Impact**: On Android 10+ (API 29+), `VOICE_COMMUNICATION` and `VOICE_CALL` are restricted from background recording by third-party apps without system signatures or Accessibility Services.
- **Remediation**:
  1. Accurately document Android OS telephony boundaries in `README.md` and `FEATURE-TEST-REPORT.md`.
  2. Provide supported user-facing actions: dialing via `ACTION_DIAL`, SMS via `ACTION_SENDTO`, and voice memo audio recording via standard microphone permission (`RECORD_AUDIO`).

---
