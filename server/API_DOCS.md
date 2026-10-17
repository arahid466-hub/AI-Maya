# Maya Queen AI — Termux Server API Specification

This document details the REST API exposed by the Maya Queen Termux server (default port `8080`).

## Architecture & Language Rules
- **Written API Output**: Strictly English (`response` string).
- **Voice Payload**: Sweet natural Hindi translation (`spokenHindi` string) for client TTS rendering.
- **Deduplication**: Client sends `x-request-id` header or `requestId` field to prevent duplicate execution.

## Endpoints

### 1. `GET /api/health`
Public health probe.
- **Response**: `{ "success": true, "status": "healthy", "uptime": 12.4, ... }`

### 2. `GET /api/status`
System status, CPU count, memory usage, and active AI engine.
- **Response**: `{ "success": true, "server": { "status": "running" }, ... }`

### 3. `GET /api/benchmark`
Roundtrip latency measurement.
- **Response**: `{ "success": true, "latencyMs": 0.4, "speedRating": "⚡ Ultra-Fast (<15ms)" }`

### 4. `POST /api/chat`
Main unified conversational and directive endpoint.
- **Headers**: `Content-Type: application/json`, `Authorization: Bearer <TOKEN>` (optional)
- **Body**:
  ```json
  {
    "message": "Turn on living room lights",
    "conversationId": "default",
    "isVoiceInput": false,
    "requestId": "req_12345"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "response": "Smart Home Directive Executed: Living room lights turned on.",
    "spokenHindi": "लिविंग रूम की लाइटें चालू कर दी गई हैं।",
    "engine": "maya-smart-home",
    "timestamp": "2026-10-17T03:00:00.000Z"
  }
  ```

### 5. `POST /api/search`
Queries DuckDuckGo search index and returns authentic source links.
- **Body**: `{ "query": "latest technology news" }`
- **Response**: `{ "success": true, "results": [ { "title": "...", "url": "https://...", "source": "..." } ] }`

### 6. `GET /api/smart-home` & `POST /api/smart-home`
Retrieve and toggle smart home devices (lights, thermostat, TV, locks).

### 7. `GET /api/reminders` & `POST /api/reminders`
Retrieve, create, toggle, and delete reminders.

### 8. `POST /api/files`
Safe sandboxed workspace file manager with path traversal protection.
- Operations: `read`, `write`, `delete`
