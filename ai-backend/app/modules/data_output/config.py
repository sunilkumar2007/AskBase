import os
from typing import Optional
from pydantic import Field

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings  # type: ignore
    SettingsConfigDict = None


class Module3Settings(BaseSettings):
    """Configuration settings for Module 3 - Data & Output."""

    # Environment
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)

    # Database Settings
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./data_storage/askbase.db"
    )
    DATABASE_SCHEMA: str = Field(default="data_output")
    DB_POOL_SIZE: int = Field(default=10)
    DB_MAX_OVERFLOW: int = Field(default=20)

    # Supabase Settings
    SUPABASE_URL: Optional[str] = Field(default=None)
    SUPABASE_KEY: Optional[str] = Field(default=None)
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = Field(default=None)

    # Storage Settings
    STORAGE_DRIVER: str = Field(default="local")  # local | supabase
    LOCAL_STORAGE_DIR: str = Field(default="./data_storage")
    STORAGE_BUCKET_UPLOADS: str = Field(default="askbase-uploads")
    STORAGE_BUCKET_EXPORTS: str = Field(default="askbase-exports")
    STORAGE_BUCKET_CACHES: str = Field(default="askbase-caches")

    # Export Settings
    MAX_EXPORT_ROWS: int = Field(default=500000)
    EXPORT_EXPIRATION_HOURS: int = Field(default=24)

    if SettingsConfigDict:
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
        )
    else:
        class Config:
            env_file = ".env"
            env_file_encoding = "utf-8"
            extra = "ignore"


settings = Module3Settings()
