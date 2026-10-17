package com.maya.assistant

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import com.maya.assistant.network.MayaApiClient
import com.maya.assistant.phone.PhoneActionHandler
import com.maya.assistant.ui.screens.MainScreen
import com.maya.assistant.voice.SpeechManager
import com.maya.assistant.voice.TtsManager

class MainActivity : ComponentActivity() {
    lateinit var apiClient: MayaApiClient
    lateinit var phoneActionHandler: PhoneActionHandler
    private var speechManager: SpeechManager? = null
    private var ttsManager: TtsManager? = null

    var isListening by mutableStateOf(false)
    var isSpeaking by mutableStateOf(false)

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val recordAudioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        if (recordAudioGranted) {
            initSpeechRecognizer()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        apiClient = MayaApiClient(this)
        phoneActionHandler = PhoneActionHandler(this)

        // Initialize Hindi TTS with female voice profile
        ttsManager = TtsManager(
            context = this,
            onInitComplete = { success, statusMsg ->
                if (!success) {
                    Toast.makeText(this, statusMsg ?: "TTS Init Notice", Toast.LENGTH_SHORT).show()
                }
            },
            onSpeakingStateChanged = { speaking ->
                isSpeaking = speaking
            }
        )

        // Check audio permissions
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
            initSpeechRecognizer()
        }

        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    MainScreen(
                        apiClient = apiClient,
                        phoneActionHandler = phoneActionHandler,
                        speechManager = speechManager,
                        ttsManager = ttsManager,
                        isListening = isListening,
                        isSpeaking = isSpeaking,
                        onStartListening = {
                            if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                                requestPermissionLauncher.launch(
                                    arrayOf(
                                        Manifest.permission.RECORD_AUDIO,
                                        Manifest.permission.CALL_PHONE,
                                        Manifest.permission.SEND_SMS,
                                        Manifest.permission.READ_CONTACTS
                                    )
                                )
                            } else {
                                speechManager?.startListening()
                            }
                        },
                        onStopListening = {
                            speechManager?.stopListening()
                        }
                    )
                }
            }
        }
    }

    private fun initSpeechRecognizer() {
        speechManager = SpeechManager(
            context = this,
            onResult = { text ->
                // Handled in MainScreen
            },
            onError = { error ->
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
            },
            onListeningStateChanged = { listening ->
                isListening = listening
            }
        )
    }

    override fun onDestroy() {
        super.onDestroy()
        speechManager?.destroy()
        ttsManager?.destroy()
    }
}
