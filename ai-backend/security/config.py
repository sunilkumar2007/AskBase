"""AskBase AI Backend - Security Configuration.

Re-exports the relevant settings from the main config module.
No dotenv loading here — handled centrally in app.config.
"""
from __future__ import annotations

from app.config import settings

__all__ = ["settings"]
