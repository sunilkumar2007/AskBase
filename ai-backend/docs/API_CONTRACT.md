# AskBase Voice API Contract

**Version:** 0.1.0
**Status:** Stable
**Audience:** Frontend developers implementing the microphone UI

---

## Overview

Voice is an input layer. Every voice request produces the same structured
response as typed chat. Frontend does NOT need specialized voice rendering.

**Base URL:** `/api/v1`

---

## 1. Authentication

All voice endpoints require a valid Bearer token.
user_id and project_id come from the authenticated session, NOT the request body.

---

## 2. POST /api/v1/voice/transcribe

Upload audio for transcription and agent processing.

**Method:** POST
**Content-Type:** multipart/form-data
**Headers:** Authorization: Bearer <access_token>

**Form Fields:**
- file (binary, required): Audio file
- conversation_id (string, optional): Continue existing conversation
- project_id (string, optional): Ignored; authenticated project_id is used
- language (string, optional): ISO 639-1 code. Default: en

**Supported Formats:**
WAV, MP3, OGG, WebM, M4A, FLAC
Max size: 25 MB, Max duration: 120 seconds
Validation uses file magic bytes, NOT filename extension.

**Response (Success):**
```json
{
 "success": true,
 "request_id": "uuid",
 "transcript": "Show me the top five products by revenue this quarter.",
 "normalized_text": "Show me the top 5 products by revenue this quarter.",
 "language": "en",
 "confidence": 0.96,
 "intent": {"primary_intent": "QUERY_DATA", "all_intents": ["QUERY_DATA"]},
 "status": "completed",
 "conversation_id": "conv_abc123",
 "agent_response": {
 "answer": "The top 5 products...",
 "sql": "SELECT ...",
 "data": {"columns": ["product", "revenue"], "rows": [...], "row_count": 5, "truncated": false},
 "chart": {"type": "bar", "spec": {}},
 "explanation": {"summary": "...", "key_insights": [], "recommendations": []},
 "follow_up": "...",
 "error": null,
 "elapsed_ms": 2340
 },
 "audio_response": null,
 "error": null,
 "elapsed_ms": 2450,
 "breakdown": {"transcription_ms": 850, "agent_ms": 1600}
}
```

**Response (Clarification Needed):**
```json
{
 "success": true,
 "status": "needs_clarification",
 "clarification_message": "Unclear number: did you mean May 15?",
 "agent_response": null,
 "error": null
}
```

**Response (Low Confidence):**
```json
{
 "success": false,
 "status": "low_confidence",
 "error": "VOICE_CONFIDENCE_LOW",
 "error_message": "Speech recognition confidence too low. Please try again."
}
```

**Response (Cancelled):**
```json
{
 "success": true,
 "status": "cancelled",
 "intent": {"primary_intent": "CANCEL", "all_intents": ["CANCEL"]}
}
```

---

## 3. Error Responses

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 400 | - | Empty audio file |
| 401 | - | Missing or invalid auth |
| 413 | VOICE_FILE_TOO_LARGE | Audio exceeds 25 MB |
| 415 | VOICE_FORMAT_UNSUPPORTED | Unsupported format |
| 422 | VOICE_TRANSCRIPTION_FAILED | STT failed |
| 500 | VOICE_PROCESSING_ERROR | Internal error |

Error body: {"detail": {"code": "...", "message": "..."}}

---

## 4. Conversation Context

Continue conversations by including conversation_id from the previous response.
The voice layer passes this to the AskBase Agent which accumulates turns.

---

## 5. Frontend State Machine

IDLE -> LISTENING -> UPLOADING -> PROCESSING -> COMPLETE
 -> NEEDS_CLARIFICATION -> SHOW_CLARIFICATION_UI
 -> LOW_CONFIDENCE -> SHOW_RETRY_UI
 -> CANCELLED -> IDLE
 -> ERROR -> SHOW_ERROR_UI

---

## 6. Intent Routing

| Intent | Frontend Action |
|--------|-----------------|
| QUERY_DATA | Display agent response |
| SHOW_SQL | Display SQL prominently |
| EXPORT_PDF | Trigger PDF download |
| EXPORT_CSV | Trigger CSV download |
| CREATE_REPORT | Show report preview |
| EXPLAIN | Show explanation panel |
| FILTER | Apply filter from normalized_text |
| CHART_BAR/LINE/PIE/SCATTER | Render appropriate chart |
| CANCEL | Return to IDLE |
| CLEAR | Clear conversation |
| REPEAT | Re-run last query |

The agent_response field has the same structure as typed chat responses.
Frontend can reuse the same rendering components.

---

## 7. Cancellation

1. Call POST /api/v1/voice/cancel
2. Stop recording / abort upload
3. Return to IDLE

---

## 8. Rate Limits

- Max audio size: 25 MB
- Max audio duration: 120 seconds
- One active voice request per user
- Apply same rate limiter as chat endpoints

---

## 9. Security

- Authentication required on all endpoints except /health
- user_id and project_id come from authenticated session
- Audio files are NOT stored on disk
- No API keys in requests or responses
- SQL validation handled by existing agent pipeline
- File validation via magic bytes (not extension)
