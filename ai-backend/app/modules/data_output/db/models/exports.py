import uuid
from typing import Optional
from sqlalchemy import String, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin


class GeneratedFile(Base, UUIDMixin, TimestampMixin):
    """Output file metadata for generated exports."""

    __tablename__ = "generated_files"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    report_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("reports.id", ondelete="SET NULL"), nullable=True, index=True
    )
    dashboard_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("dashboards.id", ondelete="SET NULL"), nullable=True, index=True
    )
    export_type: Mapped[str] = mapped_column(
        String(20), nullable=False
    )  # pdf, csv, xlsx, json, pptx
    file_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("files.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), default="completed", nullable=False
    )  # pending, completed, failed
