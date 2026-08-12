import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.analytics import (
    ChartCreate,
    ChartResponse,
    InsightCreate,
    InsightResponse,
)
from app.modules.data_output.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/projects/{project_id}/analytics", tags=["Analytics & Visualizations"])


@router.post("/charts", response_model=ChartResponse, status_code=status.HTTP_201_CREATED)
async def create_chart(
    project_id: uuid.UUID,
    chart_in: ChartCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Persist visualization chart spec linked to query result."""
    chart = await AnalyticsService.create_chart(
        db=db,
        query_result_id=chart_in.query_result_id,
        title=chart_in.title,
        chart_type=chart_in.chart_type,
        chart_spec=chart_in.chart_spec,
    )
    return chart


@router.get("/charts/{chart_id}", response_model=ChartResponse)
async def get_chart(
    project_id: uuid.UUID,
    chart_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve visualization chart spec."""
    chart = await AnalyticsService.get_chart(db, chart_id)
    if not chart:
        raise HTTPException(status_code=404, detail="Chart specification not found")
    return chart


@router.post("/insights", response_model=InsightResponse, status_code=status.HTTP_201_CREATED)
async def create_insight(
    project_id: uuid.UUID,
    insight_in: InsightCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Persist key data insight linked to query result."""
    insight = await AnalyticsService.create_insight(
        db=db,
        title=insight_in.title,
        summary=insight_in.summary,
        details=insight_in.details,
        query_result_id=insight_in.query_result_id,
    )
    return insight


@router.get("/insights", response_model=List[InsightResponse])
async def list_insights(
    project_id: uuid.UUID,
    query_result_id: Optional[uuid.UUID] = None,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List data insights in project."""
    return await AnalyticsService.list_insights(db, query_result_id)
