import uuid
from typing import Optional, List
from sqlalchemy import String, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin, JSON_TYPE


class Dashboard(Base, UUIDMixin, TimestampMixin):
    """Dashboard layout container."""

    __tablename__ = "dashboards"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    layout_config: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )

    widgets: Mapped[List["DashboardWidget"]] = relationship(
        "DashboardWidget", back_populates="dashboard", cascade="all, delete-orphan"
    )


class DashboardWidget(Base, UUIDMixin, TimestampMixin):
    """Widget item embedded in a dashboard."""

    __tablename__ = "dashboard_widgets"

    dashboard_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("dashboards.id", ondelete="CASCADE"), nullable=False, index=True
    )
    widget_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # chart, metric, table, text
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    query_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("queries.id", ondelete="SET NULL"), nullable=True
    )
    chart_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("charts.id", ondelete="SET NULL"), nullable=True
    )
    config: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)
    position: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)

    dashboard: Mapped["Dashboard"] = relationship("Dashboard", back_populates="widgets")
