import uuid
from typing import Optional
from sqlalchemy import String, Text, BigInteger, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin, JSON_TYPE


class DataSource(Base, UUIDMixin, TimestampMixin):
    """External or uploaded data source metadata."""

    __tablename__ = "data_sources"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # postgresql, duckdb, csv, excel
    connection_config_encrypted: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    schema_metadata: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)


class File(Base, UUIDMixin, TimestampMixin):
    """File metadata stored in Supabase Storage or Local Driver."""

    __tablename__ = "files"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    bucket_name: Mapped[str] = mapped_column(String(100), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    checksum: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True
    )

    __table_args__ = (
        Index("idx_files_project_checksum", "project_id", "checksum"),
        *([Base.__table_args__] if Base.__table_args__ else []),
    )
