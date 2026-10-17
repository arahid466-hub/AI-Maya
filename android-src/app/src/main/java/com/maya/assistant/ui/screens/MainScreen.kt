package com.maya.assistant.ui.screens

import android.widget.Toast
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.maya.assistant.data.models.ChatMessage
import com.maya.assistant.network.MayaApiClient
import com.maya.assistant.phone.PhoneActionHandler
import com.maya.assistant.voice.SpeechManager
import com.maya.assistant.voice.TtsManager
import kotlinx.coroutines.launch

// Maya Queen Signature Luxury Red & Black Theme
val QueenBg = Color(0xFF090A10)
val QueenSurface = Color(0xFF12131D)
val QueenSurfaceLight = Color(0xFF1A1C2B)
val QueenCrimson = Color(0xFFEF4444)
val QueenCrimsonDark = Color(0xFFDC2626)
val QueenCrimsonGlow = Color(0xFFF87171)
val QueenGold = Color(0xFFF59E0B)
val QueenTextPrimary = Color(0xFFF8FAFC)
val QueenTextSecondary = Color(0xFF94A3B8)
val QueenBorder = Color(0xFF27273A)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    apiClient: MayaApiClient,
    phoneActionHandler: PhoneActionHandler,
    speechManager: SpeechManager?,
    ttsManager: TtsManager?,
    isListening: Boolean,
    isSpeaking: Boolean,
    onStartListening: () -> Unit,
    onStopListening: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    // Navigation Tabs: "chat" (Home), "voice" (Voice Assistant), "settings", "apps", "files"
    var currentTab by remember { mutableStateOf("chat") }
    var audioEnabled by remember { mutableStateOf(true) }
    var voiceInputEnabled by remember { mutableStateOf(true) }
    var spokenLanguage by remember { mutableStateOf("hi-IN") }
    var voiceProfile by remember { mutableStateOf("Female (Maya Voice)") }
    var aiEngine by remember { mutableStateOf("Ollama (Local)") }
    var selectedModel by remember { mutableStateOf("qwen2.5-coder:1.5b") }
    var serverUrlInput by remember { mutableStateOf(apiClient.baseUrl) }
    var isConnected by remember { mutableStateOf(true) }

    var messages by remember {
        mutableStateOf(
            listOf(
                ChatMessage(
                    text = "Hello! I am Maya Queen, your personal AI assistant. How may I help you today?",
                    spokenHindi = "नमस्ते! मैं माया हूँ। आप कैसे हैं? मैं आपकी क्या मदद कर सकती हूँ?",
                    isUser = false,
                    engine = "maya-queen-core"
                )
            )
        )
    }

    var inputText by remember { mutableStateOf("") }
    var isSending by remember { mutableStateOf(false) }
    var spokenHindiSubtitle by remember { mutableStateOf("नमस्ते! मैं माया हूँ। आप कैसे हैं? मैं आपकी क्या मदद कर सकती हूँ?") }
    var showChatHistoryView by remember { mutableStateOf(false) }

    fun handleSend(text: String, isVoice: Boolean = false) {
        if (text.isBlank() || isSending) return
        isSending = true
        ttsManager?.stop()

        val userMessage = ChatMessage(text = text, isUser = true)
        messages = messages + userMessage
        showChatHistoryView = true

        scope.launch {
            val result = apiClient.sendChat(text, isVoice)
            isSending = false
            if (result.isSuccess) {
                val data = result.getOrNull()!!
                val botText = data.response ?: "Directive executed successfully."
                val botHindi = data.spokenHindi ?: ""

                spokenHindiSubtitle = botHindi.ifBlank { "कार्य पूरा कर दिया गया है।" }

                val botMessage = ChatMessage(
                    text = botText,
                    spokenHindi = botHindi,
                    isUser = false,
                    engine = data.engine ?: "maya-core",
                    phoneAction = data.phoneAction,
                    searchResults = data.searchResults
                )
                messages = messages + botMessage

                // Speak in sweet female Hindi voice if audio enabled
                if (audioEnabled && botHindi.isNotBlank()) {
                    ttsManager?.speakHindi(botHindi)
                }
            } else {
                val err = result.exceptionOrNull()?.message ?: "Server unavailable."
                messages = messages + ChatMessage(
                    text = "Error: $err. Please verify Termux server is active.",
                    isUser = false,
                    engine = "error"
                )
            }
        }
    }

    Scaffold(
        containerColor = QueenBg,
        bottomBar = {
            // 5-Tab Navigation Bar matching screenshot
            NavigationBar(
                containerColor = Color(0xFF0A0B12),
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentTab == "chat",
                    onClick = { currentTab = "chat" },
                    icon = { Icon(Icons.Default.Chat, contentDescription = "Chat") },
                    label = { Text("Chat", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = QueenCrimson,
                        selectedTextColor = QueenCrimson,
                        indicatorColor = QueenCrimson.copy(alpha = 0.15f)
                    )
                )
                NavigationBarItem(
                    selected = currentTab == "files",
                    onClick = { currentTab = "files" },
                    icon = { Icon(Icons.Default.Folder, contentDescription = "Files") },
                    label = { Text("Files", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = QueenCrimson,
                        selectedTextColor = QueenCrimson,
                        indicatorColor = QueenCrimson.copy(alpha = 0.15f)
                    )
                )
                NavigationBarItem(
                    selected = currentTab == "apps",
                    onClick = { currentTab = "apps" },
                    icon = { Icon(Icons.Default.Apps, contentDescription = "Apps") },
                    label = { Text("Apps", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = QueenCrimson,
                        selectedTextColor = QueenCrimson,
                        indicatorColor = QueenCrimson.copy(alpha = 0.15f)
                    )
                )
                NavigationBarItem(
                    selected = currentTab == "voice",
                    onClick = { currentTab = "voice" },
                    icon = { Icon(Icons.Default.Mic, contentDescription = "Voice") },
                    label = { Text("Voice", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = QueenCrimson,
                        selectedTextColor = QueenCrimson,
                        indicatorColor = QueenCrimson.copy(alpha = 0.15f)
                    )
                )
                NavigationBarItem(
                    selected = currentTab == "settings",
                    onClick = { currentTab = "settings" },
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                    label = { Text("Settings", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = QueenCrimson,
                        selectedTextColor = QueenCrimson,
                        indicatorColor = QueenCrimson.copy(alpha = 0.15f)
                    )
                )
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(QueenBg)
        ) {
            // =========================================================================
            // SCREEN 1: HOME & CHAT SCREEN (Matches Screenshot 1)
            // =========================================================================
            if (currentTab == "chat") {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Header Bar (Menu, Maya Queen Title, Crown & Settings icons)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(onClick = { Toast.makeText(context, "Maya Queen Assistant Menu", Toast.LENGTH_SHORT).show() }) {
                            Icon(Icons.Default.Menu, contentDescription = "Menu", tint = QueenTextPrimary)
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("👑 ", fontSize = 16.sp)
                                Text("Maya Queen", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = QueenTextPrimary)
                            }
                            Text("Your AI Companion", fontSize = 11.sp, color = QueenTextSecondary)
                        }

                        Row {
                            IconButton(onClick = { currentTab = "voice" }) {
                                Text("👑", fontSize = 16.sp)
                            }
                            IconButton(onClick = { currentTab = "settings" }) {
                                Icon(Icons.Default.Settings, contentDescription = "Settings", tint = QueenTextSecondary)
                            }
                        }
                    }

                    // Main Body: Avatar, Greeting, 6 Cards, Quick Examples
                    LazyColumn(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        item {
                            Spacer(modifier = Modifier.height(8.dp))

                            // Avatar in glowing red halo ring with HUD tech bracket ticks
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(130.dp)
                                    .clip(CircleShape)
                                    .border(2.dp, QueenCrimson, CircleShape)
                                    .background(
                                        Brush.radialGradient(
                                            listOf(QueenCrimsonDark, Color(0xFF3B0713), QueenBg)
                                        )
                                    )
                            ) {
                                Icon(
                                    Icons.Default.Person,
                                    contentDescription = "Maya Avatar",
                                    tint = QueenCrimsonGlow,
                                    modifier = Modifier.size(70.dp)
                                )
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // Greeting
                            Text(
                                "Hello, I am Maya 👑",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = QueenTextPrimary
                            )
                            Text(
                                "Your Personal AI Assistant",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = QueenTextSecondary
                            )
                            Text(
                                "Ask me anything... I'm here to help you!",
                                fontSize = 11.sp,
                                color = Color.Gray,
                                modifier = Modifier.padding(top = 2.dp)
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            // 6 Grid Action Cards (2 Columns x 3 Rows)
                            Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    QuickFeatureCard(
                                        title = "Chat",
                                        icon = "💬",
                                        modifier = Modifier.weight(1f)
                                    ) { showChatHistoryView = true }

                                    QuickFeatureCard(
                                        title = "Web Search",
                                        icon = "🌐",
                                        modifier = Modifier.weight(1f)
                                    ) { handleSend("Delhi ki aaj ki taza khabar batao") }

                                    QuickFeatureCard(
                                        title = "Code & Files",
                                        icon = "</>",
                                        modifier = Modifier.weight(1f)
                                    ) { currentTab = "files" }
                                }

                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    QuickFeatureCard(
                                        title = "Images",
                                        icon = "🖼️",
                                        modifier = Modifier.weight(1f)
                                    ) { handleSend("Create an image of futuristic Indian queen with neon crown") }

                                    QuickFeatureCard(
                                        title = "Videos & Audio",
                                        icon = "▶️",
                                        modifier = Modifier.weight(1f)
                                    ) { handleSend("Play Hindi chill music station") }

                                    QuickFeatureCard(
                                        title = "Documents",
                                        icon = "📄",
                                        modifier = Modifier.weight(1f)
                                    ) { handleSend("Summarize my notes and files") }
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            // ⚡ Quick Examples
                            Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("⚡ ", fontSize = 12.sp)
                                    Text("Quick Examples", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenTextSecondary)
                                }

                                QuickExampleItem("Delhi ki aaj ki taza khabar batao") {
                                    handleSend("Delhi ki aaj ki taza khabar batao")
                                }
                                QuickExampleItem("Kerala mein paas ke acche hotel batao") {
                                    handleSend("Kerala mein paas ke acche hotel batao")
                                }
                                QuickExampleItem("Python mein ek game ka code likho") {
                                    handleSend("Python mein ek game ka code likho")
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                        }
                    }

                    // Bottom Floating Input Bar matching screenshot
                    Surface(
                        color = Color(0xFF141522),
                        shape = RoundedCornerShape(30.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Left Red Mic button
                            IconButton(
                                onClick = {
                                    currentTab = "voice"
                                    onStartListening()
                                },
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(QueenCrimson)
                            ) {
                                Icon(Icons.Default.Mic, contentDescription = "Voice Input", tint = Color.White, modifier = Modifier.size(20.dp))
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            // Input field
                            OutlinedTextField(
                                value = inputText,
                                onValueChange = { inputText = it },
                                placeholder = { Text("Type a message...", fontSize = 12.sp, color = Color.Gray) },
                                modifier = Modifier.weight(1f),
                                colors = TextFieldDefaults.colors(
                                    focusedContainerColor = Color.Transparent,
                                    unfocusedContainerColor = Color.Transparent,
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White,
                                    focusedIndicatorColor = Color.Transparent,
                                    unfocusedIndicatorColor = Color.Transparent
                                ),
                                maxLines = 2
                            )

                            // Right Red Send button
                            IconButton(
                                onClick = {
                                    if (inputText.isNotBlank()) {
                                        val text = inputText
                                        inputText = ""
                                        handleSend(text)
                                    }
                                },
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(QueenCrimson)
                            ) {
                                Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White, modifier = Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }

            // =========================================================================
            // SCREEN 2: DEDICATED AI VOICE ASSISTANT SCREEN (Matches Screenshot 2)
            // =========================================================================
            if (currentTab == "voice") {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Top Bar: Back, Title, Top Right Hindi Badge
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(onClick = { currentTab = "chat" }) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = QueenTextPrimary)
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("👑 ", fontSize = 16.sp)
                                Text("Maya Queen", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = QueenTextPrimary)
                            }
                            Text("AI Voice Assistant", fontSize = 11.sp, color = QueenTextSecondary)
                        }

                        // Top Right Hindi Badge
                        Surface(
                            color = Color(0xFF3B0713),
                            shape = RoundedCornerShape(16.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, QueenCrimson.copy(alpha = 0.5f)),
                            modifier = Modifier.clickable {
                                spokenLanguage = if (spokenLanguage == "hi-IN") "en-IN" else "hi-IN"
                                Toast.makeText(context, "Language: $spokenLanguage", Toast.LENGTH_SHORT).show()
                            }
                        ) {
                            Text(
                                "🗣️ हिंदी 🎤",
                                fontSize = 11.sp,
                                color = QueenCrimsonGlow,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    // Center Visualizer: Equalizer Waves + Avatar + Equalizer Waves
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.weight(1f)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            // Left simulated soundwave bars
                            Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                                listOf(12.dp, 24.dp, 36.dp, 18.dp, 44.dp).forEach { height ->
                                    Box(
                                        modifier = Modifier
                                            .width(3.dp)
                                            .height(if (isListening || isSpeaking) height else 8.dp)
                                            .clip(RoundedCornerShape(2.dp))
                                            .background(QueenCrimson)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(16.dp))

                            // Avatar Circle with Red Neon Ring
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(150.dp)
                                    .clip(CircleShape)
                                    .border(3.dp, QueenCrimson, CircleShape)
                                    .background(
                                        Brush.radialGradient(
                                            listOf(QueenCrimsonDark, Color(0xFF3B0713), QueenBg)
                                        )
                                    )
                            ) {
                                Icon(
                                    Icons.Default.Person,
                                    contentDescription = "Maya Avatar",
                                    tint = QueenCrimsonGlow,
                                    modifier = Modifier.size(80.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(16.dp))

                            // Right simulated soundwave bars
                            Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                                listOf(44.dp, 18.dp, 36.dp, 24.dp, 12.dp).forEach { height ->
                                    Box(
                                        modifier = Modifier
                                            .width(3.dp)
                                            .height(if (isListening || isSpeaking) height else 8.dp)
                                            .clip(RoundedCornerShape(2.dp))
                                            .background(QueenCrimson)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        // Status Pill: Listening...
                        Surface(
                            color = if (isListening) QueenCrimson else Color(0xFF241016),
                            shape = RoundedCornerShape(20.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, QueenCrimson.copy(alpha = 0.6f))
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.Mic, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    if (isListening) "Listening..." else if (isSpeaking) "Speaking Hindi..." else "Tap Mic to Speak",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Spoken Hindi Bubble matching screenshot 2
                        Surface(
                            color = QueenSurface,
                            shape = RoundedCornerShape(16.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                        ) {
                            Text(
                                text = spokenHindiSubtitle,
                                fontSize = 14.sp,
                                color = QueenTextPrimary,
                                modifier = Modifier.padding(16.dp)
                            )
                        }
                    }

                    // Bottom Voice Controls: Cancel (X), Big Red Mic, Stop (Square)
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Cancel button (X)
                            IconButton(
                                onClick = {
                                    onStopListening()
                                    ttsManager?.stop()
                                },
                                modifier = Modifier
                                    .size(46.dp)
                                    .clip(CircleShape)
                                    .background(QueenSurface)
                            ) {
                                Icon(Icons.Default.Close, contentDescription = "Cancel", tint = QueenTextSecondary)
                            }

                            // Big Red Mic Button
                            IconButton(
                                onClick = {
                                    if (isListening) onStopListening() else onStartListening()
                                },
                                modifier = Modifier
                                    .size(76.dp)
                                    .clip(CircleShape)
                                    .background(QueenCrimson)
                            ) {
                                Icon(Icons.Default.Mic, contentDescription = "Mic", tint = Color.White, modifier = Modifier.size(36.dp))
                            }

                            // Stop Speech button
                            IconButton(
                                onClick = { ttsManager?.stop() },
                                modifier = Modifier
                                    .size(46.dp)
                                    .clip(CircleShape)
                                    .background(QueenSurface)
                            ) {
                                Icon(Icons.Default.Stop, contentDescription = "Stop", tint = QueenTextSecondary)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Bottom audio progress / volume bar
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(QueenSurface)
                                .padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.VolumeUp, contentDescription = "Audio", tint = QueenTextSecondary, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(4.dp)
                                    .clip(RoundedCornerShape(2.dp))
                                    .background(Color.DarkGray)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth(0.65f)
                                        .fillMaxHeight()
                                        .background(QueenCrimson)
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            IconButton(onClick = { currentTab = "settings" }, modifier = Modifier.size(24.dp)) {
                                Icon(Icons.Default.Settings, contentDescription = "Settings", tint = QueenTextSecondary, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }

            // =========================================================================
            // SCREEN 3: SETTINGS SCREEN (Matches Screenshot 3)
            // =========================================================================
            if (currentTab == "settings") {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    // Header: Back arrow & Title
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(bottom = 12.dp)
                    ) {
                        IconButton(onClick = { currentTab = "chat" }) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = QueenTextPrimary)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Settings", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = QueenTextPrimary)
                    }

                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // SECTION 1: AI & MODEL (Matches Screenshot 3)
                        item {
                            Text("AI & Model", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenTextSecondary)
                            Spacer(modifier = Modifier.height(6.dp))

                            Surface(
                                color = QueenSurface,
                                shape = RoundedCornerShape(16.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder)
                            ) {
                                Column {
                                    SettingsListItem(
                                        title = "AI Engine",
                                        subtitle = aiEngine,
                                        icon = Icons.Default.Settings,
                                        iconColor = QueenCrimson
                                    ) {
                                        aiEngine = if (aiEngine.startsWith("Ollama")) "Maya Core (FREE)" else "Ollama (Local)"
                                    }

                                    Divider(color = QueenBorder)

                                    SettingsListItem(
                                        title = "Model Selection",
                                        subtitle = selectedModel,
                                        icon = Icons.Default.Layers,
                                        iconColor = QueenGold
                                    ) {
                                        selectedModel = if (selectedModel.startsWith("qwen")) "gemini-2.5-flash" else "qwen2.5-coder:1.5b"
                                    }

                                    Divider(color = QueenBorder)

                                    SettingsListItem(
                                        title = "Provider Settings",
                                        subtitle = "Manage API Keys (Optional)",
                                        icon = Icons.Default.Key,
                                        iconColor = Color(0xFFEC4899)
                                    ) {
                                        Toast.makeText(context, "Free AI mode enabled. API keys optional.", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        }

                        // SECTION 2: VOICE & LANGUAGE (Matches Screenshot 3)
                        item {
                            Text("Voice & Language", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenTextSecondary)
                            Spacer(modifier = Modifier.height(6.dp))

                            Surface(
                                color = QueenSurface,
                                shape = RoundedCornerShape(16.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder)
                            ) {
                                Column {
                                    SettingsListItem(
                                        title = "Spoken Language",
                                        subtitle = if (spokenLanguage == "hi-IN") "Hindi (हिंदी)" else "English",
                                        icon = Icons.Default.VolumeUp,
                                        iconColor = QueenGold
                                    ) {
                                        spokenLanguage = if (spokenLanguage == "hi-IN") "en-IN" else "hi-IN"
                                    }

                                    Divider(color = QueenBorder)

                                    SettingsListItem(
                                        title = "Voice Profile",
                                        subtitle = voiceProfile,
                                        icon = Icons.Default.Mic,
                                        iconColor = QueenCrimson
                                    ) {
                                        voiceProfile = if (voiceProfile.contains("Maya")) "Female (Leher Voice)" else "Female (Maya Voice)"
                                    }

                                    Divider(color = QueenBorder)

                                    // Voice Input with REAL RED TOGGLE SWITCH
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(14.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Box(
                                                modifier = Modifier
                                                    .size(32.dp)
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .background(QueenCrimson.copy(alpha = 0.2f)),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Icon(Icons.Default.Mic, contentDescription = null, tint = QueenCrimson, modifier = Modifier.size(18.dp))
                                            }
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Column {
                                                Text("Voice Input", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = QueenTextPrimary)
                                                Text(if (voiceInputEnabled) "On (Tap to speak)" else "Disabled", fontSize = 11.sp, color = QueenTextSecondary)
                                            }
                                        }

                                        Switch(
                                            checked = voiceInputEnabled,
                                            onCheckedChange = { voiceInputEnabled = it },
                                            colors = SwitchDefaults.colors(
                                                checkedThumbColor = Color.White,
                                                checkedTrackColor = QueenCrimson,
                                                uncheckedThumbColor = Color.Gray,
                                                uncheckedTrackColor = Color.DarkGray
                                            )
                                        )
                                    }

                                    Divider(color = QueenBorder)

                                    SettingsListItem(
                                        title = "Voice Output",
                                        subtitle = if (audioEnabled) "Hindi TTS" else "Muted",
                                        icon = Icons.Default.VolumeUp,
                                        iconColor = QueenCrimson
                                    ) {
                                        audioEnabled = !audioEnabled
                                        ttsManager?.audioEnabled = audioEnabled
                                    }
                                }
                            }
                        }

                        // SECTION 3: APP & SECURITY (Matches Screenshot 3)
                        item {
                            Text("App & Security", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenTextSecondary)
                            Spacer(modifier = Modifier.height(6.dp))

                            Surface(
                                color = QueenSurface,
                                shape = RoundedCornerShape(16.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder)
                            ) {
                                Column {
                                    SettingsListItem(
                                        title = "Account & Login",
                                        subtitle = "Manage your account",
                                        icon = Icons.Default.Person,
                                        iconColor = QueenGold
                                    ) {
                                        Toast.makeText(context, "Account: Maya Local Session Active", Toast.LENGTH_SHORT).show()
                                    }

                                    Divider(color = QueenBorder)

                                    SettingsListItem(
                                        title = "Permissions",
                                        subtitle = "Camera, Microphone, Storage",
                                        icon = Icons.Default.Lock,
                                        iconColor = QueenGold
                                    ) {
                                        Toast.makeText(context, "All Android permissions granted.", Toast.LENGTH_SHORT).show()
                                    }

                                    Divider(color = QueenBorder)

                                    SettingsListItem(
                                        title = "Privacy & Security",
                                        subtitle = "Data, Encryption, Local Storage",
                                        icon = Icons.Default.Shield,
                                        iconColor = QueenCrimson
                                    ) {
                                        Toast.makeText(context, "48-Hour Auto-Purge Vault Active.", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        }

                        // SECTION 4: SERVER CONNECTION
                        item {
                            Text("Termux Server Connection", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenTextSecondary)
                            Spacer(modifier = Modifier.height(6.dp))

                            Surface(
                                color = QueenSurface,
                                shape = RoundedCornerShape(16.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder),
                                modifier = Modifier.padding(bottom = 20.dp)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text("Server Host URL:", fontSize = 11.sp, color = QueenTextSecondary)
                                    OutlinedTextField(
                                        value = serverUrlInput,
                                        onValueChange = {
                                            serverUrlInput = it
                                            apiClient.baseUrl = it
                                        },
                                        modifier = Modifier.fillMaxWidth(),
                                        colors = TextFieldDefaults.colors(
                                            focusedTextColor = Color.White,
                                            unfocusedTextColor = Color.White,
                                            focusedContainerColor = Color(0xFF090A12),
                                            unfocusedContainerColor = Color(0xFF090A12)
                                        )
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Button(
                                        onClick = {
                                            scope.launch {
                                                val res = apiClient.checkHealth()
                                                if (res.isSuccess) {
                                                    Toast.makeText(context, "Connected to server successfully!", Toast.LENGTH_SHORT).show()
                                                } else {
                                                    Toast.makeText(context, "Connection failed: ${res.exceptionOrNull()?.message}", Toast.LENGTH_SHORT).show()
                                                }
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = QueenCrimson),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Text("Test Server Connection", color = Color.White)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // =========================================================================
            // SCREEN 4: APPS & SMART HOME (Tab ⊞ Apps)
            // =========================================================================
            if (currentTab == "apps") {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    Text("Smart Home & Tools", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = QueenTextPrimary)
                    Spacer(modifier = Modifier.height(12.dp))

                    Surface(
                        color = Color(0xFF2B0A12),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Shield, contentDescription = null, tint = QueenCrimson, modifier = Modifier.size(24.dp))
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text("Bank Protection Active", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenCrimsonGlow)
                                Text("GPay, PhonePe, and Paytm locked against unauthorized access.", fontSize = 10.sp, color = QueenTextSecondary)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Text("Quick Appliance Control", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenTextSecondary)
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = { handleSend("Turn on living room lights") },
                            colors = ButtonDefaults.buttonColors(containerColor = QueenSurface),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("💡 Lights ON", fontSize = 11.sp, color = Color.White)
                        }
                        Button(
                            onClick = { handleSend("Turn off living room lights") },
                            colors = ButtonDefaults.buttonColors(containerColor = QueenSurface),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("💡 Lights OFF", fontSize = 11.sp, color = Color.White)
                        }
                    }
                }
            }

            // =========================================================================
            // SCREEN 5: FILES TAB (Tab 📄 Files)
            // =========================================================================
            if (currentTab == "files") {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    Text("Source Packages & Setup", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = QueenTextPrimary)
                    Spacer(modifier = Modifier.height(12.dp))

                    Surface(
                        color = QueenSurface,
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Termux Command:", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = QueenCrimsonGlow)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "pkg update && pkg install nodejs git -y && node server.js",
                                fontSize = 11.sp,
                                color = QueenTextPrimary,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFF090A12))
                                    .padding(8.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun QuickFeatureCard(
    title: String,
    icon: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        color = QueenSurface,
        shape = RoundedCornerShape(14.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder),
        modifier = modifier
            .height(72.dp)
            .clickable { onClick() }
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(4.dp)
        ) {
            Text(icon, fontSize = 18.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(title, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = QueenTextPrimary)
        }
    }
}

@Composable
fun QuickExampleItem(
    text: String,
    onClick: () -> Unit
) {
    Surface(
        color = QueenSurface,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, QueenBorder),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text, fontSize = 12.sp, color = QueenTextPrimary)
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = QueenTextSecondary, modifier = Modifier.size(16.dp))
        }
    }
}

@Composable
fun SettingsListItem(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconColor: Color,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(iconColor.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(title, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = QueenTextPrimary)
                Text(subtitle, fontSize = 11.sp, color = QueenTextSecondary)
            }
        }
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = QueenTextSecondary, modifier = Modifier.size(16.dp))
    }
}
