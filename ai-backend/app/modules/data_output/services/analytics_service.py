import uuid
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.db.models.analytics import Chart, Insight
from app.modules.data_output.db.models.lineage import DataLineage


class AnalyticsService:
    """Service handling charts, AI insights, and data lineage graph queries."""

    @staticmethod
    async def create_chart(
        db: AsyncSession,
        query_result_id: uuid.UUID,
        title: str,
        chart_type: str,
        chart_spec: dict,
    ) -> Chart:
        """Persist visualization chart spec linked to query result."""
        chart = Chart(
            query_result_id=query_result_id,
            title=title,
            chart_type=chart_type,
            chart_spec=chart_spec,
        )
        db.add(chart)
        await db.flush()
        return chart

    @staticmethod
    async def get_chart(db: AsyncSession, chart_id: uuid.UUID) -> Optional[Chart]:
        """Retrieve chart spec by ID."""
        res = await db.execute(select(Chart).where(Chart.id == chart_id))
        return res.scalar_one_or_none()

    @staticmethod
    async def list_charts_by_result(
        db: AsyncSession, query_result_id: uuid.UUID
    ) -> List[Chart]:
        """List all charts generated for a query result."""
        res = await db.execute(
            select(Chart).where(Chart.query_result_id == query_result_id)
        )
        return res.scalars().all()

    @staticmethod
    async def create_insight(
        db: AsyncSession,
        title: str,
        summary: str,
        details: Optional[dict] = None,
        query_result_id: Optional[uuid.UUID] = None,
    ) -> Insight:
        """Persist data insight linked to query result."""
        insight = Insight(
            query_result_id=query_result_id,
            title=title,
            summary=summary,
            details=details or {},
        )
        db.add(insight)
        await db.flush()
        return insight

    @staticmethod
    async def list_insights(
        db: AsyncSession, query_result_id: Optional[uuid.UUID] = None
    ) -> List[Insight]:
        """List insights linked to query result or general insights."""
        stmt = select(Insight)
        if query_result_id:
            stmt = stmt.where(Insight.query_result_id == query_result_id)
        res = await db.execute(stmt)
        return res.scalars().all()

    @staticmethod
    async def get_lineage_graph(
        db: AsyncSession, project_id: uuid.UUID
    ) -> Tuple[List[DataLineage], int, int]:
        """Retrieve data lineage graph edges for project."""
        res = await db.execute(
            select(DataLineage).where(DataLineage.project_id == project_id)
        )
        edges = res.scalars().all()
        
        nodes = set()
        for edge in edges:
            nodes.add((edge.source_type, edge.source_id))
            nodes.add((edge.target_type, edge.target_id))

        return (edges, len(nodes), len(edges))
