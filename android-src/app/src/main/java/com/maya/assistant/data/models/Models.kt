package com.maya.assistant.data.models

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val text: String,               // Written English AI text
    val spokenHindi: String? = null, // Hindi translation for audio speech
    val isUser: Boolean,
    val timestamp: Long = System.currentTimeMillis(),
    val engine: String? = null,
    val phoneAction: PhoneAction? = null,
    val searchResults: List<SearchResultItem>? = null,
    val isStreaming: Boolean = false
)

data class ChatRequest(
    val message: String,
    val conversationId: String = "default",
    val isVoiceInput: Boolean = false,
    val requestId: String = "req_" + System.currentTimeMillis()
)

data class ChatResponse(
    val success: Boolean,
    val response: String?,
    val spokenHindi: String?,
    val conversationId: String?,
    val engine: String?,
    val phoneAction: PhoneAction?,
    val searchResults: List<SearchResultItem>?,
    val error: String?
)

data class PhoneAction(
    val type: String, // 'phone_call' | 'send_sms' | 'open_app' | 'toggle_torch' | 'adjust_volume' | 'open_camera'
    val action: String,
    val target: String? = null,
    val recipient: String? = null,
    val message: String? = null,
    val appName: String? = null,
    val state: Boolean? = null,
    val requiresConfirmation: Boolean = true,
    val description: String = ""
)

data class SearchResultItem(
    val title: String,
    val url: String,
    val source: String,
    val snippet: String
)

data class ServerHealth(
    val success: Boolean,
    val status: String,
    val uptime: Double,
    val platform: String?,
    val arch: String?
)

data class SmartDeviceItem(
    val id: String,
    val name: String,
    val room: String,
    val type: String,
    val state: Boolean,
    val value: Int? = null,
    val color: String? = null
)
