"""AskBase AI Backend - Voice command layer package.

Voice is an INPUT layer that feeds clean text into the existing AskBase Agent.
"""
from voice.config import VoiceSettings
from voice.exceptions import (
	VOICE_AGENT_ERROR,
	VOICE_AMBIGUOUS_INPUT,
	VOICE_CONFIDENCE_LOW,
	VOICE_CONVERSATION_NOT_FOUND,
	VOICE_FILE_EMPTY,
	VOICE_FILE_INVALID,
	VOICE_FILE_TOO_LARGE,
	VOICE_FORMAT_UNSUPPORTED,
	VOICE_PROCESSING_ERROR,
	VOICE_PROJECT_NOT_FOUND,
	VOICE_PROVIDER_UNAVAILABLE,
	VOICE_TRANSCRIPTION_FAILED,
	VOICE_TRANSCRIPTION_TIMEOUT,
	VoiceAgentError,
	VoiceCancelled,
	VoiceError,
	VoiceFileError,
	VoiceProcessingError,
	VoiceTranscriptionError,
)
from voice.providers.base import BaseSTTProvider, BaseTTSProvider
from voice.validation import detect_mime_type, get_extension, validate_audio_upload

__all__ = [
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
