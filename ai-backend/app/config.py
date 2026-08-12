"""AskBase AI Backend - Configuration Module 2"""
from __future__ import annotations

import os
from typing import Literal

from pydantic import Field, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────────────
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    PORT: int = Field(default=3001, ge=1, le=65535)
    CORS_ORIGINS: str = Field(default="http://localhost:5173")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    # ── Gemini ────────────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = Field(default="")
    GEMINI_MODEL: str = Field(default="gemini-2.0-flash")

    # ── Supabase ──────────────────────────────────────────────────────────────
    SUPABASE_URL: str = Field(default="")
    SUPABASE_ANON_KEY: str = Field(default="")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="")

    # ── Database (AskBase app data) ───────────────────────────────────────────
    DATABASE_URL: str = Field(default="")

    # ── Authentication ────────────────────────────────────────────────────────
    JWT_SECRET: str = Field(default="")
    JWT_ALGORITHM: str = Field(default="HS256")

    # ── Query safety ──────────────────────────────────────────────────────────
    QUERY_TIMEOUT_SECONDS: int = Field(default=30, ge=1, le=120)
    QUERY_MAX_ROWS: int = Field(default=10_000, ge=1, le=100_000)

    # ── Convenience flags ─────────────────────────────────────────────────────
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    def validate_required(self) -> None:
        """Raise if critical env vars are missing in non-development mode."""
        if self.is_development:
            return
        required = ["GEMINI_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "JWT_SECRET", "DATABASE_URL"]
        missing = [k for k in required if not getattr(self, k)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")


try:
    settings = Settings()
    settings.validate_required()
except ValidationError as exc:
    raise RuntimeError(
        "Invalid environment configuration for AskBase backend. "
        "Check your .env file against .env.example.\n" + str(exc)
    ) from exc
