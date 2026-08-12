import uuid
from typing import Optional, List
from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin, JSON_TYPE


class Query(Base, UUIDMixin, TimestampMixin):
    """SQL or analytical query execution record."""

    __tablename__ = "queries"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    chat_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("chats.id", ondelete="SET NULL"), nullable=True, index=True
    )
    raw_sql: Mapped[str] = mapped_column(Text, nullable=False)
    compiled_sql: Mapped[str] = mapped_column(Text, nullable=False)
    dialect: Mapped[str] = mapped_column(String(50), default="postgres", nullable=False)
    is_read_only: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )

    results: Mapped[List["QueryResult"]] = relationship(
        "QueryResult", back_populates="query", cascade="all, delete-orphan"
    )


class QueryResult(Base, UUIDMixin, TimestampMixin):
    """Cached execution results and summary metadata."""

    __tablename__ = "query_results"

    query_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("queries.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(
        String(50), default="completed", nullable=False
    )  # completed, failed, running
    row_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    execution_time_ms: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    columns_schema: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)
    result_cache_path: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    query: Mapped["Query"] = relationship("Query", back_populates="results")


class SavedQuery(Base, UUIDMixin, TimestampMixin):
    """Reusable query templates saved by project users."""

    __tablename__ = "saved_queries"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sql_template: Mapped[str] = mapped_column(Text, nullable=False)
    parameters_schema: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )
