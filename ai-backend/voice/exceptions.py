"""AskBase AI Backend - Voice-layer exception taxonomy.

Each exception maps to a stable error code the frontend can rely on.
Never expose internal stack traces.
"""
from __future__ import annotations


class VoiceError(Exception):
	"""Base voice exception."""
	def __init__(self, code: str, message: str):
		self.code = code
		self.message = message
		super().__init__(message)


# Audio validation errors
VOICE_FILE_INVALID = "VOICE_FILE_INVALID"
VOICE_FILE_TOO_LARGE = "VOICE_FILE_TOO_LARGE"
VOICE_FORMAT_UNSUPPORTED = "VOICE_FORMAT_UNSUPPORTED"
VOICE_DURATION_INVALID = "VOICE_DURATION_INVALID"
VOICE_FILE_EMPTY = "VOICE_FILE_EMPTY"

# Transcription errors
VOICE_TRANSCRIPTION_FAILED = "VOICE_TRANSCRIPTION_FAILED"
VOICE_TRANSCRIPTION_TIMEOUT = "VOICE_TRANSCRIPTION_TIMEOUT"
VOICE_PROVIDER_UNAVAILABLE = "VOICE_PROVIDER_UNAVAILABLE"
VOICE_LANGUAGE_UNSUPPORTED = "VOICE_LANGUAGE_UNSUPPORTED"

# Processing errors
VOICE_PROCESSING_ERROR = "VOICE_PROCESSING_ERROR"
VOICE_CONFIDENCE_LOW = "VOICE_CONFIDENCE_LOW"
VOICE_AMBIGUOUS_INPUT = "VOICE_AMBIGUOUS_INPUT"

# Integration errors
VOICE_AGENT_ERROR = "VOICE_AGENT_ERROR"
VOICE_AUTH_REQUIRED = "VOICE_AUTH_REQUIRED"
VOICE_PROJECT_NOT_FOUND = "VOICE_PROJECT_NOT_FOUND"
VOICE_CONVERSATION_NOT_FOUND = "VOICE_CONVERSATION_NOT_FOUND"

# Cancellation
VOICE_CANCELLED = "VOICE_CANCELLED"


class VoiceFileError(VoiceError):
	"""Raised when uploaded audio fails validation."""


class VoiceTranscriptionError(VoiceError):
	"""Raised when STT fails or returns an unusable result."""


class VoiceProcessingError(VoiceError):
	"""Raised when post-transcription processing fails."""


class VoiceAgentError(VoiceError):
	"""Raised when the downstream AskBase Agent fails."""


class VoiceCancelled(VoiceError):
	"""Raised when the user cancels the operation."""
