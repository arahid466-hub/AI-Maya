package com.maya.assistant.phone

import android.content.Context
import android.media.MediaRecorder
import android.os.Build
import android.util.Log
import java.io.File

/**
 * Manages local voice note and memo recording using standard microphone input.
 * 
 * Note on Android Platform Limitations:
 * On modern Android (Android 10+ / API 29+), third-party non-system applications
 * are restricted by Google Android privacy rules from silently recording phone call audio 
 * (VOICE_CALL / VOICE_COMMUNICATION audio streams) without Accessibility or InCallService system roles.
 * This class uses standard MediaRecorder (MIC) for legitimate voice notes, memos, and dictation.
 */
class CallRecordingManager(private val context: Context) {
    private var mediaRecorder: MediaRecorder? = null
    var isRecording: Boolean = false
        private set
    private var currentFile: File? = null

    fun startVoiceMemo(label: String): File? {
        if (isRecording) return currentFile
        try {
            val memosDir = File(context.filesDir, "voice_memos").apply {
                if (!exists()) mkdirs()
            }
            val sanitized = label.replace("[^a-zA-Z0-9]".toRegex(), "_")
            val file = File(memosDir, "memo_${sanitized}_${System.currentTimeMillis()}.m4a")
            currentFile = file

            mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                MediaRecorder(context)
            } else {
                @Suppress("DEPRECATION")
                MediaRecorder()
            }.apply {
                setAudioSource(MediaRecorder.AudioSource.MIC)
                setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                setAudioEncodingBitRate(128000)
                setAudioSamplingRate(44100)
                setOutputFile(file.absolutePath)
                prepare()
                start()
            }
            isRecording = true
            return file
        } catch (e: Exception) {
            Log.e("MayaVoiceMemo", "Failed to start recording: ${e.message}")
            stopVoiceMemo()
            return null
        }
    }

    fun stopVoiceMemo(): File? {
        if (!isRecording) return currentFile
        return try {
            mediaRecorder?.apply {
                stop()
                reset()
                release()
            }
            mediaRecorder = null
            isRecording = false
            currentFile
        } catch (e: Exception) {
            mediaRecorder = null
            isRecording = false
            currentFile
        }
    }
}
