import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class WidgetCreate(BaseModel):
    widget_type: str = Field(..., pattern="^(chart|metric|table|text)$")
    title: str
    query_id: Optional[uuid.UUID] = None
    chart_id: Optional[uuid.UUID] = None
    config: dict = Field(default_factory=dict)
    position: dict = Field(default_factory=dict)


class WidgetUpdate(BaseModel):
    title: Optional[str] = None
    config: Optional[dict] = None
    position: Optional[dict] = None
    query_id: Optional[uuid.UUID] = None
    chart_id: Optional[uuid.UUID] = None


class WidgetResponse(BaseModel):
    id: uuid.UUID
    dashboard_id: uuid.UUID
    widget_type: str
    title: str
    query_id: Optional[uuid.UUID] = None
    chart_id: Optional[uuid.UUID] = None
    config: dict
    position: dict
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    layout_config: dict = Field(default_factory=dict)


class DashboardUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    layout_config: Optional[dict] = None


class DashboardResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    description: Optional[str] = None
    layout_config: dict
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardDetailResponse(DashboardResponse):
    widgets: List[WidgetResponse] = Field(default_factory=list)
