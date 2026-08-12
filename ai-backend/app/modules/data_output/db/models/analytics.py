import uuid
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin, JSON_TYPE


class Chart(Base, UUIDMixin, TimestampMixin):
    """Visualization metadata and spec for frontend rendering."""

    __tablename__ = "charts"

    query_result_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("query_results.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    chart_type: Mapped[str] = mapped_column(String(50), nullable=False)  # bar, line, pie, scatter
    chart_spec: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)


class Insight(Base, UUIDMixin, TimestampMixin):
    """Key data insights linked to query results or reports."""

    __tablename__ = "insights"

    query_result_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("query_results.id", ondelete="CASCADE"), nullable=True, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    details: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)


class Report(Base, UUIDMixin, TimestampMixin):
    """Structured report document."""

    __tablename__ = "reports"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content_structure: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )
