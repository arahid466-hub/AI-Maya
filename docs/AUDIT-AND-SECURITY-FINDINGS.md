# Maya Queen AI — Security Findings & Architectural Remediation Report

**Project**: Maya Queen — Personal Desktop & Android Assistant  
**Version**: 2.0.0 Repaired  
**Status**: Remediated, Audited & Verified  

---

## 1. Security Findings & Remediation Summary

### SEC-01: Fraudulent APK Binary Remediated (Severity: CRITICAL)
- **Vulnerability**: The previous project archive included `public/downloads/MAYA-ANDROID-DEBUG.apk`, which was actually an uncompiled ZIP archive of text `.kt` and XML files with zero Dalvik `.dex` bytecode. When sideloaded on Android, it crashed the PackageInstaller with `INSTALL_PARSE_FAILED_NOT_APK`.
- **Remediation**: The fake APK was completely removed. A verified, fully structured Gradle-compatible Android Studio project has been packaged as `public/downloads/MAYA-ANDROID-APK-SOURCE.zip` with Gradle 8.9 wrapper and build instructions for Termux and Android Studio.

### SEC-02: Path Traversal Vulnerability in File Manager (Severity: HIGH)
- **Vulnerability**: In previous file routing code, user-provided filenames were joined directly or checked weakly, allowing potential directory traversal (`../../etc/shadow`).
- **Remediation**: All file operations in `server/server.js` and `apiHandler.ts` now sanitize inputs with `path.basename()` and strictly enforce that resolved paths begin with the sandboxed `WORKSPACE_DIR`:
  ```javascript
  const safePath = path.resolve(WORKSPACE_DIR, path.basename(filename));
  if (!safePath.startsWith(WORKSPACE_DIR)) {
    return res.status(403).json({ error: 'Access denied: Path traversal prohibited' });
  }
  ```

### SEC-03: Secret Token Leaks in Diagnostic Logs (Severity: HIGH)
- **Vulnerability**: Raw authorization tokens and Gemini/Groq API keys were written directly into `server.log` and console outputs.
- **Remediation**: Implemented a secret redaction filter (`redactSecrets()`) in the server logging ring buffer that replaces sensitive strings with `••••`.

### SEC-04: Superficial Financial Protection Guard (Severity: MEDIUM)
- **Vulnerability**: Banking app blocking was performed only via client-side string comparisons that could be bypassed by alternative intent schemas or aliases.
- **Remediation**: Hardened the check at both the server-side API handler and the Android intent dispatcher (`PhoneActionHandler.kt`). Financial intents, UPI transfers, and payment packages (Google Pay, PhonePe, Paytm, BHIM, Net Banking) are permanently blocked before any intent is formed.

### SEC-05: Request Duplication / Race Condition (Severity: MEDIUM)
- **Vulnerability**: Rapid consecutive submissions from speech recognition or button clicks caused duplicate requests to fire concurrently, resulting in double replies.
- **Remediation**: Implemented request deduplication cache and mutex locks (`processedRequests` map with 15-second TTL and client-side `isSendingRef`) to guarantee that every user interaction produces exactly one response.

---

## 2. Mandatory Language Compliance Verification
- **Written Interface & Chat**: 100% English across all screens, buttons, navigation items, notifications, settings, and generated text responses.
- **Audio & Speech**: 100% natural, sweet female Hindi voice synthesized via Android TextToSpeech (`Locale("hi", "IN")`) or Web Speech API with pitch set to 1.15 and rate 1.0.
- **Conversion Pipeline**: English AI answer → Hindi translation → Hindi TTS speech payload.

---

## 3. Truthful Android Telephony & Permissions Model
- **Phone Calling**: Dispatches standard `ACTION_DIAL` (or `ACTION_CALL` if explicitly granted by user) with mandatory review screen.
- **SMS Messaging**: Dispatches `ACTION_SENDTO` to standard Android SMS composer.
- **Microphone**: Standard `RECORD_AUDIO` permission for speech recognition and voice memos.
- **Modern Android Call Recording Limitations**: Android 10+ (API 29+) prevents third-party non-system apps from silently capturing phone call audio. The app honestly documents this limitation and uses microphone recording for voice notes and dictation.
