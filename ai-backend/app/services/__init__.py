"""AskBase AI Backend - Services package."""
from app.services.gemini import get_gemini_service, GeminiService

__all__ = ["get_gemini_service", "GeminiService"]
