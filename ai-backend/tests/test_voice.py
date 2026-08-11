"""AskBase AI Backend - Voice layer tests."""
from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from voice.exceptions import (
	VOICE_FILE_EMPTY,
	VOICE_FILE_TOO_LARGE,
	VOICE_FORMAT_UNSUPPORTED,
	VOICE_TRANSCRIPTION_FAILED,
	VoiceFileError,
	VoiceTranscriptionError,
)
from voice.processing import (
	detect_intent,
	fix_punctuation,
	is_cancel_command,
	is_confirmation,
	normalize_number_words,
	process_transcript,
	remove_fillers,
	remove_repeated_phrases,
)
from voice.validation import detect_mime_type, get_extension, validate_audio_upload


class TestAudioValidation:
	def test_empty_audio_rejected(self):
		with pytest.raises(VoiceFileError) as exc:
			validate_audio_upload(b"", "test.wav", "audio/wav")
		assert exc.value.code == VOICE_FILE_EMPTY

	def test_wav_magic_detected(self):
		wav_header = b"RIFF\x00\x00\x00\x00WAVEfmt "
		result = detect_mime_type(wav_header)
		assert result == "audio/wav"

	def test_mp3_magic_detected(self):
		mp3_header = b"ID3\x03\x00\x00\x00"
		result = detect_mime_type(mp3_header)
		assert result == "audio/mpeg"

	def test_unsupported_format_rejected(self):
		with pytest.raises(VoiceFileError) as exc:
			validate_audio_upload(b"GIF89a", "test.gif", "image/gif")
		assert exc.value.code == VOICE_FORMAT_UNSUPPORTED

	def test_extension_extraction(self):
		assert get_extension("audio.wav") == "wav"
		assert get_extension("recording.mp3") == "mp3"


class TestTranscriptProcessing:
	def test_remove_fillers(self):
		text = "uh show me um the top five products"
		result = remove_fillers(text)
		assert "uh" not in result
		assert "um" not in result
		assert "show" in result

	def test_remove_repeated_phrases(self):
		text = "show me the the top products by by revenue"
		result = remove_repeated_phrases(text)
		assert "the the" not in result
		assert "by by" not in result

	def test_normalize_numbers(self):
		assert "5" in normalize_number_words("top five products")
		# Year-style "twenty twenty six" stays as separate numbers to avoid ambiguity
		result = normalize_number_words("twenty twenty six")
		assert "2026" in result or "20" in result
		assert "1.5" in normalize_number_words("one point five")

	def test_fix_punctuation(self):
		text = "show me sales. what is the total?"
		result = fix_punctuation(text)
		assert result[0].isupper()

	def test_detect_intent_query(self):
		result = detect_intent("show me sales")
		assert result["primary_intent"] == "QUERY_DATA"

	def test_detect_intent_export(self):
		result = detect_intent("export this as pdf")
		assert result["primary_intent"] == "EXPORT_PDF"

	def test_detect_intent_chart(self):
		result = detect_intent("show as line chart")
		assert result["primary_intent"] == "CHART_LINE"

	def test_detect_intent_cancel(self):
		result = detect_intent("stop that")
		assert result["primary_intent"] == "CANCEL"

	def test_is_cancel_command(self):
		assert is_cancel_command("stop") is True
		assert is_cancel_command("cancel") is True
		assert is_cancel_command("show me sales") is False

	def test_is_confirmation(self):
		assert is_confirmation("yes") is True
		assert is_confirmation("no") is False
		assert is_confirmation("show me sales") is None

	def test_full_pipeline(self):
		raw = "uh okay show me um top five products by by revenue"
		result = process_transcript(raw)
		assert result["is_cancel"] is False
		assert result["needs_clarification"] is False
		assert "5" in result["normalized"]
		assert "top" in result["normalized"]


class TestSTTProvider:
	@pytest.mark.asyncio
	async def test_gemini_stt_transcribe(self):
		from voice.providers.gemini_stt import GeminiSTTProvider

		provider = GeminiSTTProvider()

		mock_gemini = MagicMock()
		mock_gemini.enabled = True
		mock_gemini.generate_structured = AsyncMock(return_value={
			"transcript": "Show me the top five products",
			"confidence": 0.95,
			"language": "en",
		})
		provider._gemini = mock_gemini

		result = await provider.transcribe(b"fake-audio-bytes", "en")

		assert result["text"] == "Show me the top five products"
		assert result["confidence"] == 0.95
		assert result["provider"] == "gemini"

	@pytest.mark.asyncio
	async def test_gemini_stt_empty_transcript_raises(self):
		from voice.providers.gemini_stt import GeminiSTTProvider

		provider = GeminiSTTProvider()

		mock_gemini = MagicMock()
		mock_gemini.enabled = True
		mock_gemini.generate_structured = AsyncMock(return_value={
			"transcript": "",
			"confidence": 0.0,
		})
		provider._gemini = mock_gemini

		with pytest.raises(VoiceTranscriptionError) as exc:
			await provider.transcribe(b"fake-audio", "en")
		assert exc.value.code == VOICE_TRANSCRIPTION_FAILED


class TestVoiceService:
	@pytest.mark.asyncio
	async def test_process_voice_request_success(self):
		from voice.service import VoiceService

		service = VoiceService()
		wav_bytes = b"RIFF\x00\x00\x00\x00WAVEfmt " + b"\x00" * 100

		mock_agent = MagicMock()
		mock_agent.process_question = AsyncMock(return_value={
			"answer": "Test answer",
			"sql": "SELECT 1",
			"data": {"columns": ["id"], "rows": [[1]], "row_count": 1, "truncated": False},
			"chart": None,
			"explanation": None,
			"follow_up": "",
			"error": None,
			"elapsed_ms": 100,
		})
		mock_session = MagicMock()
		mock_ctx = MagicMock()
		mock_ctx.conversation_id = "conv_test"
		mock_ctx_instance = MagicMock()
		mock_ctx_instance.conversation_id = "conv_test"
		mock_ctx_cls = MagicMock(return_value=mock_ctx_instance)

		# Mock the STT provider to avoid importing broken app modules
		mock_stt = MagicMock()
		mock_stt.transcribe = AsyncMock(return_value={
			"text": "Show me top five products",
			"confidence": 0.95,
			"language": "en",
		})

		with patch("voice.service._get_agent_class", return_value=MagicMock(return_value=mock_agent)):
			with patch("voice.service._get_agent_context_class", return_value=mock_ctx_cls):
				with patch("voice.service._get_settings", return_value=MagicMock(DATABASE_URL=None)):
					service._stt = mock_stt
					result = await service.process_voice_request(
						session=mock_session,
						audio_bytes=wav_bytes,
						filename="test.wav",
						content_type="audio/wav",
						conversation_id=None,
						project_id="proj_123",
						user_id="user_456",
					)

		assert result["success"] is True
		assert result["status"] == "completed"
		assert result["agent_response"] is not None
		assert "request_id" in result
		assert "conversation_id" in result


class TestCommandDetection:
	def test_export_pdf_intent(self):
		result = detect_intent("export this as pdf")
		assert result["primary_intent"] == "EXPORT_PDF"

	def test_show_sql_intent(self):
		result = detect_intent("show me the sql query")
		assert result["primary_intent"] == "SHOW_SQL"

	def test_filter_intent(self):
		result = detect_intent("only show electronics")
		assert result["primary_intent"] == "FILTER"

	def test_compare_intent(self):
		result = detect_intent("compare this with last year")
		assert result["primary_intent"] == "COMPARE"

	def test_clear_intent(self):
		result = detect_intent("clear the chat")
		assert result["primary_intent"] == "CLEAR"

	def test_chart_type_conflict(self):
		result = detect_intent("show as bar chart and line chart")
		assert result["primary_intent"].startswith("CHART_")
