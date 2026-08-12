import uuid
from typing import Optional
from sqlalchemy import String, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin, JSON_TYPE


class DataLineage(Base, UUIDMixin, TimestampMixin):
    """Directed graph edge tracking source-to-result data provenance."""

    __tablename__ = "data_lineage"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    source_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # data_source, file, query, query_result
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    target_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # query, chart, report, dashboard_widget, generated_file
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    edge_type: Mapped[str] = mapped_column(
        String(50), default="derived_from", nullable=False
    )  # derived_from, renders, exports_to
    metadata_json: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)

    __table_args__ = (
        Index("idx_lineage_source", "source_type", "source_id"),
        Index("idx_lineage_target", "target_type", "target_id"),
        *([Base.__table_args__] if Base.__table_args__ else []),
    )
