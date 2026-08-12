"""AskBase AI Backend - Gemini Speech-to-Text provider.

Uses Gemini's native audio input capability via the Files API.
"""
from __future__ import annotations

import logging
from typing import Any

from app.services.gemini import get_gemini_service
from app.voice.exceptions import VoiceTranscriptionError
from app.voice.providers.base import BaseSTTProvider


logger = logging.getLogger("askbase")


class GeminiSTTProvider(BaseSTTProvider):
	provider_name = "gemini"

	def __init__(self):
		self._gemini = None

	async def _get_gemini(self):
		if self._gemini is None:
			from app.services.gemini import get_gemini_service
			self._gemini = get_gemini_service()
		return self._gemini

	async def transcribe(self, audio_bytes: bytes, language: str = "en") -> dict:
		"""Transcribe audio using Gemini's multimodal capability.

		Note: Gemini processes audio as inline_data (base64).
		We send a prompt asking for transcription in the target language.
		"""
		gemini = await self._get_gemini()
		if not gemini.enabled:
			raise VoiceTranscriptionError(
				code="VOICE_PROVIDER_UNAVAILABLE",
				message="Gemini API not configured.",
			)


		try:
			import base64
			audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

			prompt = (
				"You are a precise speech-to-text engine.\n"
				"Transcribe the following audio exactly as spoken.\n"
				"Rules:\n"
				"- Preserve the original language.\n"
				"- Include filler words if clearly spoken.\n"
				"- Preserve numbers, names, dates exactly.\n"
				"- Return ONLY the transcript, nothing else.\n"
				"- If the audio is empty or silent, return an empty string."
			)

			# Use the new generate method that accepts parts
			parts = [
				{"text": prompt},
				{
					"inline_data": {
						"mime_type": "audio/wav",
						"data": audio_b64,
					}
				},
			]

			result = await gemini.generate_structured(

				prompt=prompt,
				response_schema={
					"type": "object",
					"properties": {
						"transcript": {"type": "string"},
						"language": {"type": "string"},
						"confidence": {"type": "number"},
					},
					"required": ["transcript"],
				},
			)

			transcript = result.get("transcript", "").strip()
			if not transcript:
				raise VoiceTranscriptionError(
					code="VOICE_TRANSCRIPTION_FAILED",
					message="Empty transcript returned by provider.",
				)

			return {
				"text": transcript,
				"confidence": float(result.get("confidence", 0.85)),
				"language": result.get("language", language),
				"provider": self.provider_name,
			}

		except VoiceTranscriptionError:
			raise
		except Exception as exc:
			logger.exception("Gemini STT failed.")
			raise VoiceTranscriptionError(
				code="VOICE_TRANSCRIPTION_FAILED",
				message=f"Transcription failed: {type(exc).__name__}",
			) from exc

	async def transcribe_stream(
		self, audio_stream: Any, language: str = "en"
	):
		"""Streaming transcription not yet supported for Gemini."""
		raise NotImplementedError(
			"Streaming transcription is not supported for Gemini STT. "
			"Use the batch transcribe() method."
		)
