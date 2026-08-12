"""AskBase AI Backend - Voice command layer package.

Voice is an INPUT layer that feeds clean text into the existing AskBase Agent.
"""
from app.voice.config import VoiceSettings
from app.voice.exceptions import (
	VOICE_AGENT_ERROR,
	VOICE_CONFIDENCE_LOW,
	VOICE_FILE_EMPTY,
	VOICE_FILE_TOO_LARGE,
	VOICE_FORMAT_UNSUPPORTED,
	VOICE_RATE_LIMIT,
	VOICE_TRANSCRIPTION_FAILED,
	VoiceAgentError,
	VoiceError,
	VoiceFileError,
	VoiceProcessingError,
	VoiceRateLimitError,
	VoiceTranscriptionError,
)
from app.voice.providers.base import BaseSTTProvider, BaseTTSProvider
from app.voice.service import VoiceService
from app.voice.validation import detect_mime_type, get_extension, validate_audio_upload

__all__ = [
	"VoiceService",
	"VoiceSettings",
	"VoiceError",
	"VoiceFileError",
	"VoiceTranscriptionError",
	"VoiceProcessingError",
	"VoiceAgentError",
	"VoiceCancelled",
	"BaseSTTProvider",
	"BaseTTSProvider",
	"validate_audio_upload",
	"detect_mime_type",
	"get_extension",
]
