import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.db.models.dashboard import Dashboard, DashboardWidget
from app.modules.data_output.db.models.lineage import DataLineage


class DashboardService:
    """Service handling dashboard container CRUD and embedded widget management."""

    @staticmethod
    async def create_dashboard(
        db: AsyncSession,
        project_id: uuid.UUID,
        user_id: uuid.UUID,
        title: str,
        description: Optional[str] = None,
        layout_config: Optional[dict] = None,
    ) -> Dashboard:
        """Create new dashboard container."""
        dashboard = Dashboard(
            project_id=project_id,
            title=title,
            description=description,
            layout_config=layout_config or {},
            created_by=user_id,
        )
        db.add(dashboard)
        await db.flush()
        return dashboard

    @staticmethod
    async def get_dashboard(
        db: AsyncSession, project_id: uuid.UUID, dashboard_id: uuid.UUID
    ) -> Optional[Dashboard]:
        """Retrieve dashboard container with attached widgets."""
        res = await db.execute(
            select(Dashboard)
            .where(Dashboard.id == dashboard_id, Dashboard.project_id == project_id)
        )
        return res.scalar_one_or_none()

    @staticmethod
    async def list_dashboards(
        db: AsyncSession, project_id: uuid.UUID
    ) -> List[Dashboard]:
        """List all dashboards in project."""
        res = await db.execute(
            select(Dashboard).where(Dashboard.project_id == project_id)
        )
        return res.scalars().all()

    @staticmethod
    async def update_dashboard(
        db: AsyncSession,
        project_id: uuid.UUID,
        dashboard_id: uuid.UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
        layout_config: Optional[dict] = None,
    ) -> Optional[Dashboard]:
        """Update dashboard details and layout configuration."""
        dashboard = await DashboardService.get_dashboard(db, project_id, dashboard_id)
        if not dashboard:
            return None

        if title is not None:
            dashboard.title = title
        if description is not None:
            dashboard.description = description
        if layout_config is not None:
            dashboard.layout_config = layout_config

        await db.flush()
        return dashboard

    @staticmethod
    async def delete_dashboard(
        db: AsyncSession, project_id: uuid.UUID, dashboard_id: uuid.UUID
    ) -> bool:
        """Delete dashboard and cascade-delete embedded widgets."""
        dashboard = await DashboardService.get_dashboard(db, project_id, dashboard_id)
        if not dashboard:
            return False

        await db.delete(dashboard)
        await db.flush()
        return True

    @staticmethod
    async def add_widget(
        db: AsyncSession,
        project_id: uuid.UUID,
        dashboard_id: uuid.UUID,
        widget_type: str,
        title: str,
        query_id: Optional[uuid.UUID] = None,
        chart_id: Optional[uuid.UUID] = None,
        config: Optional[dict] = None,
        position: Optional[dict] = None,
    ) -> Optional[DashboardWidget]:
        """Add embedded widget to dashboard."""
        dashboard = await DashboardService.get_dashboard(db, project_id, dashboard_id)
        if not dashboard:
            return None

        widget = DashboardWidget(
            dashboard_id=dashboard_id,
            widget_type=widget_type,
            title=title,
            query_id=query_id,
            chart_id=chart_id,
            config=config or {},
            position=position or {},
        )
        db.add(widget)
        await db.flush()

        # Register data lineage for widget rendering
        if query_id or chart_id:
            lineage = DataLineage(
                project_id=project_id,
                source_type="chart" if chart_id else "query",
                source_id=chart_id or query_id,
                target_type="dashboard_widget",
                target_id=widget.id,
                edge_type="renders",
                metadata_json={"widget_type": widget_type, "title": title},
            )
            db.add(lineage)

        return widget

    @staticmethod
    async def remove_widget(
        db: AsyncSession, project_id: uuid.UUID, dashboard_id: uuid.UUID, widget_id: uuid.UUID
    ) -> bool:
        """Remove embedded widget from dashboard."""
        res = await db.execute(
            select(DashboardWidget).where(
                DashboardWidget.id == widget_id, DashboardWidget.dashboard_id == dashboard_id
            )
        )
        widget = res.scalar_one_or_none()
        if not widget:
            return False

        await db.delete(widget)
        await db.flush()
        return True
