from datetime import datetime, timezone
import uuid
from typing import Any
from sqlalchemy import MetaData, DateTime, JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.modules.data_output.config import settings

# Dialect-agnostic type mappings (JSONB in PostgreSQL / Supabase, JSON in SQLite)
JSON_TYPE = JSONB().with_variant(JSON(), "sqlite")

# Naming convention for indexes and constraints
POSTGRES_NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

target_schema = None if "sqlite" in settings.DATABASE_URL else settings.DATABASE_SCHEMA

metadata = MetaData(
    schema=target_schema,
    naming_convention=POSTGRES_NAMING_CONVENTION,
)


class Base(DeclarativeBase):
    """Base Declarative Class for Module 3 Models."""

    metadata = metadata
    __table_args__ = {"schema": target_schema} if target_schema else {}


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class UUIDMixin:
    """Mixin for UUID primary key."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )
