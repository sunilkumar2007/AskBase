"""AskBase AI Backend - Gemini AI Service.

Clean abstraction over the Google Generative AI SDK.
Never exposes API keys. Model is configurable via env vars.
"""
from __future__ import annotations

import logging
import os
from typing import Any

from google import genai
from google.genai import types

from app.config import settings

logger = logging.getLogger("askbase")


class GeminiService:
    """Singleton-style Gemini client wrapper."""

    def __init__(self):
        self._client = None
        self._model_name = settings.GEMINI_MODEL
        self._enabled = False

    # ── Lazy init ───────────────────────────────────────────────────────────────
    def _ensure_client(self):
        if self._client is not None:
            return self._client
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.warning("GEMINI_API_KEY not configured — AI features disabled.")
            self._enabled = False
            return None
        try:
            self._client = genai.Client(api_key=api_key)
            self._enabled = True
            return self._client
        except Exception:
            logger.exception("Failed to initialize Gemini client.")
            self._enabled = False
            return None

    @property
    def enabled(self) -> bool:
        return self._client is not None and self._enabled

    @property
    def model_name(self) -> str:
        return self._model_name

    def set_model(self, model_name: str) -> None:
        """Allow runtime model override."""
        self._model_name = model_name
        logger.info("Gemini model set to: %s", model_name)

    # ── Text generation ─────────────────────────────────────────────────────────

    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate a text response."""
        client = self._ensure_client()
        if client is None:
            return ""

        try:
            response = client.models.generate_content(
                model=self._model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=kwargs.get("temperature", 0.2),
                    max_output_tokens=kwargs.get("max_output_tokens", 2048),
                ),
            )
            return response.text or ""
        except Exception:
            logger.exception("Gemini generation failed.")
            return ""

    # ── Structured output ──────────────────────────────────────────────────────

    async def generate_structured(self, prompt: str, response_schema: dict[str, Any], **kwargs) -> dict[str, Any]:
        """Generate JSON-structured output conforming to the given schema."""
        client = self._ensure_client()
        if client is None:
            return {}

        try:
            response = client.models.generate_content(
                model=self._model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=response_schema,
                    temperature=kwargs.get("temperature", 0.1),
                    max_output_tokens=kwargs.get("max_output_tokens", 4096),
                ),
            )
            import json
            text = response.text or "{}"
            return json.loads(text)
        except Exception:
            logger.exception("Gemini structured generation failed.")
            return {}

    # ── Streaming (returns a sync iterable, exposed as async) ──────────────────

    def stream(self, prompt: str, **kwargs):
        """Yield response chunks as they arrive."""
        client = self._ensure_client()
        if client is None:
            return

        try:
            for chunk in client.models.generate_content_stream(
                model=self._model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=kwargs.get("temperature", 0.2),
                ),
            ):
                if chunk.text:
                    yield chunk.text
        except Exception:
            logger.exception("Gemini streaming failed.")


# ── Singleton accessor ───────────────────────────────────────────────────────

_gemini_instance: GeminiService | None = None


def get_gemini_service() -> GeminiService:
    global _gemini_instance
    if _gemini_instance is None:
        _gemini_instance = GeminiService()
    return _gemini_instance
