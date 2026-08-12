"""AskBase AI Backend - Abstract voice provider interfaces.

Keeps STT/TTS implementation-independent.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import AsyncIterator


class BaseSTTProvider(ABC):
	"""Abstract speech-to-text provider."""

	provider_name: str = "base"

	@abstractmethod
	async def transcribe(self, audio_bytes: bytes, language: str = "en") -> dict:
		"""Transcribe audio bytes to text.

		Returns:
			{
				"text": str,
				"confidence": float,
				"language": str,
				"provider": str,
			}
		"""
		...

	@abstractmethod
	async def transcribe_stream(
		self, audio_stream: AsyncIterator[bytes], language: str = "en"
	) -> AsyncIterator[dict]:
		"""Stream transcription chunks."""
		...


class BaseTTSProvider(ABC):
	"""Abstract text-to-speech provider."""

	provider_name: str = "base"

	@abstractmethod
	async def synthesize(self, text: str, voice: str | None = None) -> bytes:
		"""Synthesize speech from text.

		Returns:
			Audio bytes (typically MP3 or WAV).
		"""
		...
