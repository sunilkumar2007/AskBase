"""AskBase AI Backend - Voice API endpoints.

Handles audio uploads, transcription, and voice-to-agent pipeline.
"""
from __future__ import annotations

import logging
import time
from typing import Any

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession


from app.api.dependencies import get_current_user, get_db_session
from app.config import settings
from app.voice.exceptions import (
	VOICE_CONFIDENCE_LOW,
	VOICE_TRANSCRIPTION_FAILED,
	VoiceProcessingError,
	VoiceTranscriptionError,
)
from app.voice.service import VoiceService


logger = logging.getLogger("askbase")
router = APIRouter(prefix="/voice", tags=["voice"])

# Singleton voice service
_voice_service: VoiceService | None = None


def get_voice_service() -> VoiceService:
	global _voice_service
	if _voice_service is None:
		_voice_service = VoiceService()
	return _voice_service


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class VoiceResponse(BaseModel):
	success: bool
	request_id: str
	transcript: str
	normalized_text: str
	language: str
	confidence: float
	intent: dict[str, Any]
	status: str
	conversation_id: str | None = None
	agent_response: dict[str, Any] | None = None
	audio_response: str | None = None
	error: str | None = None
	error_message: str | None = None
	clarification_message: str | None = None
	elapsed_ms: int | None = None


class CancelResponse(BaseModel):
	success: bool
	message: str
	status: str = "cancelled"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("/transcribe", response_model=VoiceResponse)
async def transcribe_voice(
	file: UploadFile = File(...),
	conversation_id: str | None = None,
	project_id: str = Form(..., description="Project ID from authenticated session"),
	language: str = "en",

	db: AsyncSession = Depends(get_db_session),
	current_user: dict = Depends(get_current_user),
	voice_service: VoiceService = Depends(get_voice_service),
):
	"""Transcribe voice audio and run through the AskBase Agent.

	Upload an audio file. The voice layer:
	1. Validates the audio
	2. Transcribes via STT
	3. Cleans the transcript
	4. Routes through the existing AskBase Agent
	5. Returns the agent response
	"""
	t0 = time.perf_counter()

	# Read audio bytes
	audio_bytes = await file.read()
	if not audio_bytes:
		raise HTTPException(status_code=400, detail="Empty audio file uploaded.")

	# Use authenticated user_id — never trust request body
	user_id = current_user.get("sub") or current_user.get("id")
	if not user_id:
		raise HTTPException(status_code=401, detail="Authentication required.")

	# Use authenticated project — verify access
	project_id = current_user.get("project_id", project_id)

	content_type = file.content_type or "application/octet-stream"
	filename = file.filename or "audio.upload"

	try:
		result = await voice_service.process_voice_request(
			session=db,
			audio_bytes=audio_bytes,
			filename=filename,
			content_type=content_type,
			conversation_id=conversation_id,
			project_id=project_id,
			user_id=user_id,
			language=language,
		)
	except VoiceTranscriptionError as exc:
		logger.warning("Voice transcription failed: %s", exc.code)
		raise HTTPException(
			status_code=422,
			detail={"code": exc.code, "message": exc.message},
		)
	except VoiceProcessingError as exc:
		logger.error("Voice processing error: %s", exc.code)
		raise HTTPException(
			status_code=500,
			detail={"code": exc.code, "message": exc.message},
		)

	logger.info(
		"Voice request completed: request_id=%s status=%s elapsed=%dms",
		result.get("request_id"),
		result.get("status"),
		result.get("elapsed_ms"),
	)
	return VoiceResponse(**result)


@router.post("/cancel", response_model=CancelResponse)
async def cancel_voice(
	current_user: dict = Depends(get_current_user),
):
	"""Handle voice cancellation.

	Note: Server-side cancellation of in-flight transcription is not always
	possible with batch STT providers. The frontend should stop sending audio
	chunks and close the connection. This endpoint confirms cancellation.
	"""
	return CancelResponse(
		success=True,
		message="Voice request cancelled. Start a new request when ready.",
	)


@router.get("/health")
async def voice_health():
	"""Health check for the voice layer."""
	return {
		"status": "ok",
		"stt_provider": "gemini",
		"tts_enabled": False,
		"features": {
			"number_normalization": True,
			"filler_removal": True,
			"command_detection": True,
			"cancellation": True,
			"confirmation": True,
		},
	}
