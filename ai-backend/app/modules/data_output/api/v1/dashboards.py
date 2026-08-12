import uuid
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.dashboard import (
    DashboardCreate,
    DashboardUpdate,
    DashboardResponse,
    DashboardDetailResponse,
    WidgetCreate,
    WidgetResponse,
)
from app.modules.data_output.services.dashboard_service import DashboardService

router = APIRouter(prefix="/projects/{project_id}/dashboards", tags=["Dashboards & Widgets"])


@router.post("", response_model=DashboardResponse, status_code=status.HTTP_201_CREATED)
async def create_dashboard(
    project_id: uuid.UUID,
    dash_in: DashboardCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Create a new dashboard container."""
    dash = await DashboardService.create_dashboard(
        db=db,
        project_id=project_id,
        user_id=user_id,
        title=dash_in.title,
        description=dash_in.description,
        layout_config=dash_in.layout_config,
    )
    return dash


@router.get("", response_model=List[DashboardResponse])
async def list_dashboards(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List dashboards in project."""
    return await DashboardService.list_dashboards(db, project_id)


@router.get("/{dashboard_id}", response_model=DashboardDetailResponse)
async def get_dashboard(
    project_id: uuid.UUID,
    dashboard_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve dashboard detail with embedded widget list."""
    dash = await DashboardService.get_dashboard(db, project_id, dashboard_id)
    if not dash:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return dash


@router.put("/{dashboard_id}", response_model=DashboardResponse)
async def update_dashboard(
    project_id: uuid.UUID,
    dashboard_id: uuid.UUID,
    dash_update: DashboardUpdate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Update dashboard metadata and layout configuration."""
    dash = await DashboardService.update_dashboard(
        db=db,
        project_id=project_id,
        dashboard_id=dashboard_id,
        title=dash_update.title,
        description=dash_update.description,
        layout_config=dash_update.layout_config,
    )
    if not dash:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return dash


@router.delete("/{dashboard_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dashboard(
    project_id: uuid.UUID,
    dashboard_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Delete dashboard container and cascade-delete embedded widgets."""
    deleted = await DashboardService.delete_dashboard(db, project_id, dashboard_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Dashboard not found")


@router.post("/{dashboard_id}/widgets", response_model=WidgetResponse, status_code=status.HTTP_201_CREATED)
async def add_widget(
    project_id: uuid.UUID,
    dashboard_id: uuid.UUID,
    widget_in: WidgetCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Add an embedded widget to dashboard grid layout."""
    widget = await DashboardService.add_widget(
        db=db,
        project_id=project_id,
        dashboard_id=dashboard_id,
        widget_type=widget_in.widget_type,
        title=widget_in.title,
        query_id=widget_in.query_id,
        chart_id=widget_in.chart_id,
        config=widget_in.config,
        position=widget_in.position,
    )
    if not widget:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return widget


@router.delete("/{dashboard_id}/widgets/{widget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_widget(
    project_id: uuid.UUID,
    dashboard_id: uuid.UUID,
    widget_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Remove embedded widget from dashboard."""
    removed = await DashboardService.remove_widget(db, project_id, dashboard_id, widget_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Widget not found")
