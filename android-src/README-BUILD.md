# Maya Queen Android Application — Build & Installation Manual

This directory contains the complete repaired Android application source code built with **Kotlin 2.0**, **Jetpack Compose (Material3)**, **OkHttp**, and Native Android APIs.

---

## 1. Important Audit Finding: Previous Fake APK Remediated

In the previous project archive, the file named `MAYA-ANDROID-DEBUG.apk` was **not a compiled Android package**. It was a ZIP archive containing plain text `.kt` Kotlin files and text XML without `classes.dex` or `resources.arsc`, which caused Android's package manager to fail with:
`"There was a problem parsing the package"` (`INSTALL_PARSE_FAILED_NOT_APK`).

This source package provides the complete, clean Android Studio and Gradle project structure ready to compile into a genuine signed APK.

---

## 2. Prerequisites for Building

- **Android Studio Ladybug (2024.2+)** or command line Android SDK
- **JDK 17 or JDK 21** (`export JAVA_HOME=...`)
- **Android SDK Platform 35 (Android 15)**
- Minimum supported Android version: **Android 7.0 (API Level 24)** — wide compatibility across older and new phones

---

## 3. Quick Build via Gradle Wrapper

From terminal inside the `android-src/` directory:

```bash
# Ensure execution permissions on the wrapper
chmod +x gradlew

# Build Debug APK
./gradlew assembleDebug
```

The compiled APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`

---

## 4. How to Build in Android Termux (On-Device)

To build this Android project directly on your Android phone using Termux:

```bash
# 1. Update Termux packages and install OpenJDK 17
pkg update -y
pkg install -y openjdk-17 gradle git

# 2. Verify Java installation
java -version

# 3. Navigate to the android-src directory
cd ~/maya-ai/android-src

# 4. Compile the debug APK
gradle assembleDebug
```

---

## 5. Installing the Compiled APK on Android

1. **Allow Unknown Sources**:
   - Go to phone **Settings → Apps → Special App Access → Install Unknown Apps**.
   - Select your browser (Chrome) or File Manager and toggle **"Allow from this source"** to ON.
2. **Google Play Protect**:
   - If prompted with *"Unrecognized developer"*, tap **"More details" → "Install anyway"**.
3. **ADB Sideloading**:
   ```bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 6. Language Architecture
- **Written Interface**: 100% English only across all screens, buttons, messages, and settings.
- **Spoken Voice**: Sweet natural Hindi voice (`hi-IN`) generated via Text-to-Speech synthesis with dedicated rate and pitch controls.
