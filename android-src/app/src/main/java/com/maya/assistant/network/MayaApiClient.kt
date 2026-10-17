package com.maya.assistant.network

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.maya.assistant.data.models.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import java.util.concurrent.TimeUnit

class MayaApiClient(private val context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("maya_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    private val client = OkHttpClient.Builder()
        .connectTimeout(8, TimeUnit.SECONDS)
        .readTimeout(25, TimeUnit.SECONDS)
        .writeTimeout(12, TimeUnit.SECONDS)
        .build()

    var baseUrl: String
        get() = prefs.getString("server_url", "http://127.0.0.1:8080") ?: "http://127.0.0.1:8080"
        set(value) = prefs.edit().putString("server_url", value.trimEnd('/')).apply()

    var authToken: String
        get() = prefs.getString("auth_token", "") ?: ""
        set(value) = prefs.edit().putString("auth_token", value.trim()).apply()

    private fun buildRequest(endpoint: String, method: String = "GET", body: RequestBody? = null): Request {
        val url = "$baseUrl$endpoint"
        val builder = Request.Builder().url(url)
        if (authToken.isNotEmpty()) {
            builder.addHeader("Authorization", "Bearer $authToken")
            builder.addHeader("x-maya-token", authToken)
        }
        if (method == "POST" && body != null) {
            builder.post(body)
        } else {
            builder.get()
        }
        return builder.build()
    }

    suspend fun checkHealth(): Result<ServerHealth> = withContext(Dispatchers.IO) {
        try {
            val request = buildRequest("/api/health")
            val response = client.newCall(request).execute()
            if (!response.isSuccessful) {
                return@withContext Result.failure(IOException("Server HTTP ${response.code}"))
            }
            val bodyString = response.body?.string() ?: ""
            val health = gson.fromJson(bodyString, ServerHealth::class.java)
            Result.success(health)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun sendChat(message: String, isVoice: Boolean = false): Result<ChatResponse> = withContext(Dispatchers.IO) {
        try {
            val reqPayload = ChatRequest(message = message, isVoiceInput = isVoice)
            val jsonBody = gson.toJson(reqPayload).toRequestBody(jsonMediaType)
            val request = buildRequest("/api/chat", method = "POST", body = jsonBody)
            val response = client.newCall(request).execute()
            val bodyString = response.body?.string() ?: ""

            if (!response.isSuccessful) {
                return@withContext Result.failure(IOException("Maya Server Error HTTP ${response.code}: $bodyString"))
            }
            val chatRes = gson.fromJson(bodyString, ChatResponse::class.java)
            if (!chatRes.success) {
                return@withContext Result.failure(IOException(chatRes.error ?: "Chat failed"))
            }
            Result.success(chatRes)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun clearHistory(): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val body = "{}".toRequestBody(jsonMediaType)
            val request = buildRequest("/api/chat/clear", method = "POST", body = body)
            val response = client.newCall(request).execute()
            Result.success(response.isSuccessful)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
