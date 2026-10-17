package com.maya.assistant.voice

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import java.util.Locale

class TtsManager(
    private val context: Context,
    private val onInitComplete: (Boolean, String?) -> Unit,
    private val onSpeakingStateChanged: (Boolean) -> Unit
) {
    private var tts: TextToSpeech? = null
    var isInitialized: Boolean = false
        private set

    var speechRate: Float = 1.0f
    var speechPitch: Float = 1.15f // Higher pitch for sweet female voice profile
    var audioEnabled: Boolean = true

    init {
        tts = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                isInitialized = true
                val checkMsg = applyHindiVoice()
                onInitComplete(true, checkMsg)
            } else {
                isInitialized = false
                onInitComplete(false, "Text-to-Speech initialization failed on device.")
            }
        }

        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                onSpeakingStateChanged(true)
            }
            override fun onDone(utteranceId: String?) {
                onSpeakingStateChanged(false)
            }
            override fun onError(utteranceId: String?) {
                onSpeakingStateChanged(false)
            }
        })
    }

    private fun applyHindiVoice(): String {
        if (!isInitialized) return "TTS not ready"
        val hindiLocale = Locale("hi", "IN")
        val result = tts?.setLanguage(hindiLocale)

        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            tts?.language = Locale.ENGLISH
            return "Hindi voice pack not installed. Defaulting to English voice."
        }

        // Search for installed female Hindi voice
        try {
            val voices: Set<Voice>? = tts?.voices
            val femaleHindiVoice = voices?.find { voice ->
                val name = voice.name.lowercase()
                voice.locale.language == "hi" && (name.contains("female") || name.contains("f0") || name.contains("maya"))
            }
            if (femaleHindiVoice != null) {
                tts?.voice = femaleHindiVoice
            }
        } catch (e: Exception) {}

        tts?.setSpeechRate(speechRate)
        tts?.setPitch(speechPitch)
        return "Hindi (India) female voice active."
    }

    fun speakHindi(text: String) {
        if (!isInitialized || !audioEnabled || text.isBlank()) return
        applyHindiVoice()
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "maya_voice_${System.currentTimeMillis()}")
    }

    fun stop() {
        if (!isInitialized) return
        tts?.stop()
        onSpeakingStateChanged(false)
    }

    fun destroy() {
        try {
            tts?.stop()
            tts?.shutdown()
            tts = null
        } catch (e: Exception) {}
    }
}
