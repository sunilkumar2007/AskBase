"""AskBase AI Backend - Audio file validation.

Validates uploaded audio files before transcription.
"""
from __future__ import annotations

import hashlib
import logging
from pathlib import PurePath
from typing import BinaryIO

from voice.config import VoiceSettings
from voice.exceptions import (
	VOICE_DURATION_INVALID,
	VOICE_FILE_EMPTY,
	VOICE_FILE_INVALID,
	VOICE_FILE_TOO_LARGE,
	VOICE_FORMAT_UNSUPPORTED,
	VoiceFileError,
)

logger = logging.getLogger("askbase")

# Try to import audio libraries; fall back gracefully
_HAVE_WAV = False
_HAVE_MP3 = False
try:
	import wave
	_HAVE_WAV = True
except ImportError:
	logger.info("wave module not available — WAV duration check disabled.")
try:
	import mutagen
	_HAVE_MP3 = True
except ImportError:
	logger.info("mutagen not available — MP3/OGG duration check disabled.")


def detect_mime_type(file_bytes: bytes) -> str:
	"""Detect MIME type from file magic bytes."""
	# WAV
	if file_bytes[:4] == b"RIFF" and file_bytes[8:12] == b"WAVE":
		return "audio/wav"
	# MP3 (ID3 or ADTS)
	if file_bytes[:3] == b"ID3" or file_bytes[:2] == b"\xff\xfb":
		return "audio/mpeg"
	# OGG
	if file_bytes[:4] == b"OggS":
		return "audio/ogg"
	# WebM/Matroska
	if file_bytes[:4] == b"\x1a\x45\xdf\xa3":
		return "audio/webm"
	# FLAC
	if file_bytes[:4] == b"fLaC":
		return "audio/flac"
	# M4A (MP4 container)
	if file_bytes[4:8] == b"ftyp":
		if b"M4A" in file_bytes[:12] or b"mp42" in file_bytes[:12]:
			return "audio/m4a"
	return "application/octet-stream"


def get_extension(filename: str) -> str:
	"""Get lowercase file extension."""
	return PurePath(filename).suffix.lower().lstrip(".")


def validate_audio_upload(file_bytes: bytes, filename: str, content_type: str) -> dict:
	"""Validate an uploaded audio file.

	Raises:
		VoiceFileError with one of: VOICE_FILE_INVALID, VOICE_FILE_TOO_LARGE,
		VOICE_FORMAT_UNSUPPORTED, VOICE_DURATION_INVALID, VOICE_FILE_EMPTY
	"""
	cfg = VoiceSettings()

	# Empty check
	if not file_bytes:
		raise VoiceFileError(code=VOICE_FILE_EMPTY, message="Uploaded audio file is empty.")

	# Size check
	if len(file_bytes) > cfg.max_audio_size:
		raise VoiceFileError(
			code=VOICE_FILE_TOO_LARGE,
			message=f"Audio file exceeds maximum size of {cfg.max_audio_size // (1024*1024)} MB.",
		)

	# MIME check via magic bytes
	detected_mime = detect_mime_type(file_bytes)
	if detected_mime == "application/octet-stream":
		raise VoiceFileError(
			code=VOICE_FORMAT_UNSUPPORTED,
			message="Could not detect audio format from file content.",
		)

	# Extension cross-check (not the sole check, but useful)
	ext = get_extension(filename)
	if ext not in cfg.allowed_formats:
		logger.warning("Audio extension '%s' not in allowed list.", ext)

	# MIME type cross-check
	if content_type.lower() not in cfg.allowed_mime_types:
		logger.warning("Content-type '%s' not in allowed MIME list.", content_type)

	# Duration check where possible
	duration = _detect_duration(file_bytes, detected_mime)
	if duration is not None:
		if duration < cfg.min_audio_duration:
			raise VoiceFileError(
				code=VOICE_DURATION_INVALID,
				message=f"Audio too short ({duration:.1f}s, minimum {cfg.min_audio_duration}s).",
			)
		if duration > cfg.max_audio_duration:
			raise VoiceFileError(
				code=VOICE_DURATION_INVALID,
				message=f"Audio too long ({duration:.1f}s, maximum {cfg.max_audio_duration}s).",
			)

	# Content hash for idempotency
	content_hash = hashlib.sha256(file_bytes).hexdigest()[:16]

	return {
		"valid": True,
		"detected_mime": detected_mime,
		"detected_extension": ext,
		"file_size": len(file_bytes),
		"duration_seconds": duration,
		"content_hash": content_hash,
	}


def _detect_duration(file_bytes: bytes, mime: str) -> float | None:
	"""Try to detect audio duration in seconds."""
	# WAV
	if mime == "audio/wav" and _HAVE_WAV:
		try:
			import io
			with wave.open(io.BytesIO(file_bytes), "rb") as wf:
				frames = wf.getnframes()
				rate = wf.getframerate()
				if rate > 0:
					return frames / float(rate)
		except Exception:
			logger.debug("Could not read WAV duration.", exc_info=True)
			return None

	# MP3/OGG/M4A via mutagen
	if _HAVE_MP3:
		try:
			import io
			from mutagen import File as MutagenFile
			audio = MutagenFile(io.BytesIO(file_bytes))
			if audio is not None and audio.info is not None:
				return float(audio.info.length)
		except Exception:
			logger.debug("Could not read audio duration via mutagen.", exc_info=True)

	return None
