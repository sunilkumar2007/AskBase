"""AskBase AI Backend - Voice layer configuration.

All voice settings come from environment variables.
No hardcoded API keys or secrets.
"""
from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class VoiceSettings:
	# Audio limits
	max_audio_size: int = 25 * 1024 * 1024 # 25 MB
	max_audio_duration: int = 120 # seconds
	min_audio_duration: int = 1 # seconds
	allowed_formats: tuple[str, ...] = ("wav", "mp3", "ogg", "webm", "m4a", "flac")
	allowed_mime_types: tuple[str, ...] = (
		"audio/wav",
		"audio/wave",
		"audio/x-wav",
		"audio/mp3",
		"audio/mpeg",
		"audio/ogg",
		"audio/webm",
		"audio/m4a",
		"audio/x-m4a",
		"audio/flac",
	)

	# STT provider
	stt_provider: str = os.getenv("VOICE_STT_PROVIDER", "gemini")
	stt_api_key: str | None = os.getenv("VOICE_STT_API_KEY") or os.getenv("GEMINI_API_KEY")
	stt_model: str = os.getenv("VOICE_STT_MODEL", "gemini-2.0-flash")
	stt_timeout: int = int(os.getenv("VOICE_STT_TIMEOUT", "30"))
	stt_max_retries: int = int(os.getenv("VOICE_STT_MAX_RETRIES", "2"))

	# TTS provider
	tts_provider: str = os.getenv("VOICE_TTS_PROVIDER", "none")
	tts_api_key: str | None = os.getenv("VOICE_TTS_API_KEY")
	tts_voice: str = os.getenv("VOICE_TTS_VOICE", "en-US-Neural2-F")

	# Language
	default_language: str = os.getenv("VOICE_DEFAULT_LANGUAGE", "en")

	# Feature flags
	enable_tts: bool = os.getenv("VOICE_ENABLE_TTS", "false").lower() == "true"
	enable_command_detection: bool = True
	enable_number_normalization: bool = True
	enable_filler_removal: bool = True
