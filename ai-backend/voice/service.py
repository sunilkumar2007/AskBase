"""AskBase AI Backend - Voice service orchestrator.

Ties together validation, STT, processing, and the AskBase Agent.
"""
from __future__ import annotations

import logging
import time
import uuid
from typing import Any

from app.agent.agent import Agent
from app.agent.context import AgentContext
from app.config import settings
from sqlalchemy.ext.asyncio import AsyncSession

from voice.config import VoiceSettings
from voice.exceptions import (
	VOICE_AGENT_ERROR,
	VOICE_CONFIDENCE_LOW,
	VOICE_TRANSCRIPTION_FAILED,
	VoiceAgentError,
	VoiceProcessingError,
	VoiceTranscriptionError,
)
from voice.providers.gemini_stt import GeminiSTTProvider
from voice.providers.base import BaseSTTProvider
from voice.processing import process_transcript
from voice.validation import validate_audio_upload

logger = logging.getLogger("askbase")


class VoiceService:
	"""Orchestrates the complete voice request pipeline."""

	def __init__(self):
		self._cfg = VoiceSettings()
		self._stt = self._create_stt_provider()

	def _create_stt_provider(self) -> BaseSTTProvider:
		provider = self._cfg.stt_provider.lower()
		if provider == "gemini":
			return GeminiSTTProvider()
		raise ValueError(f"Unsupported STT provider: {provider}")

	async def process_voice_request(
		self,
		session: AsyncSession,
		audio_bytes: bytes,
		filename: str,
		content_type: str,
		conversation_id: str | None,
		project_id: str,
		user_id: str,
		language: str = "en",
	) -> dict[str, Any]:
		"""Process a complete voice request.

		Flow:
		1. Validate audio
		2. Transcribe
		3. Clean transcript
		4. Check cancel / confirmation
		5. Route through AskBase Agent
		6. Return structured response
		"""
		request_id = str(uuid.uuid4())
		t0 = time.perf_counter()

		logger.info(
			"Voice request: request_id=%s project_id=%s user_id=%s size=%d",
			request_id, project_id, user_id, len(audio_bytes),
		)

		# Step 1: Validate audio
		validation = validate_audio_upload(audio_bytes, filename, content_type)

		# Step 2: Transcribe
		try:
			stt_result = await self._stt.transcribe(audio_bytes, language)
		except VoiceTranscriptionError:
			raise
		except Exception as exc:
			logger.exception("STT provider error.")
			raise VoiceTranscriptionError(
				code=VOICE_TRANSCRIPTION_FAILED,
				message="Speech-to-text provider error.",
			) from exc

		transcript = stt_result["text"]
		confidence = stt_result["confidence"]
		transcription_ms = round((time.perf_counter() - t0) * 1000)

		logger.info(
			"Voice transcribed: request_id=%s transcript='%s' confidence=%.2f",
			request_id, transcript[:80], confidence,
		)

		# Step 3: Process transcript
		processed = process_transcript(transcript, language=stt_result.get("language", language))

		# Step 4: Handle cancel
		if processed["is_cancel"]:
			return {
				"success": True,
				"request_id": request_id,
				"transcript": transcript,
				"normalized_text": processed["normalized"],
				"language": processed["language"],
				"confidence": confidence,
				"intent": {"primary_intent": "CANCEL", "all_intents": ["CANCEL"]},
				"status": "cancelled",
				"agent_response": None,
				"audio_response": None,
				"error": None,
				"elapsed_ms": round((time.perf_counter() - t0) * 1000),
			}

		# Step 5: Handle clarification needed
		if processed["needs_clarification"]:
			return {
				"success": True,
				"request_id": request_id,
				"transcript": transcript,
				"normalized_text": processed["normalized"],
				"language": processed["language"],
				"confidence": confidence,
				"intent": processed["intent"],
				"status": "needs_clarification",
				"clarification_message": processed["clarification_reason"],
				"agent_response": None,
				"audio_response": None,
				"error": None,
				"elapsed_ms": round((time.perf_counter() - t0) * 1000),
			}

		# Step 6: Low confidence warning
		if confidence < 0.5:
			return {
				"success": False,
				"request_id": request_id,
				"transcript": transcript,
				"normalized_text": processed["normalized"],
				"language": processed["language"],
				"confidence": confidence,
				"intent": processed["intent"],
				"status": "low_confidence",
				"agent_response": None,
				"audio_response": None,
				"error": VOICE_CONFIDENCE_LOW,
				"error_message": "Speech recognition confidence too low. Please try again.",
				"elapsed_ms": round((time.perf_counter() - t0) * 1000),
			}

		# Step 7: Build context and run agent
		try:
			context = AgentContext(
				conversation_id=conversation_id or str(uuid.uuid4()),
				project_id=project_id,
				user_id=user_id,
				database_url=getattr(settings, "DATABASE_URL", None),
			)

			agent = Agent()
			agent_response = await agent.process_question(
				session=session,
				context=context,
				question=processed["normalized"],
			)
		except VoiceAgentError:
			raise
		except Exception as exc:
			logger.exception("Agent processing failed for voice request %s.", request_id)
			raise VoiceAgentError(
				code=VOICE_AGENT_ERROR,
				message="Agent processing failed.",
			) from exc

		total_ms = round((time.perf_counter() - t0) * 1000)

		return {
			"success": True,
			"request_id": request_id,
			"transcript": transcript,
			"normalized_text": processed["normalized"],
			"language": processed["language"],
			"confidence": confidence,
			"intent": processed["intent"],
			"status": "completed",
			"conversation_id": context.conversation_id,
			"agent_response": agent_response,
			"audio_response": None,
			"error": None,
			"elapsed_ms": total_ms,
			"breakdown": {
				"transcription_ms": transcription_ms,
				"agent_ms": total_ms - transcription_ms,
			},
		}
