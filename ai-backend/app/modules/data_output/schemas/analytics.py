import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class ChartCreate(BaseModel):
    query_result_id: uuid.UUID
    title: str = Field(..., max_length=255)
    chart_type: str = Field(..., pattern="^(bar|line|pie|scatter|area|table)$")
    chart_spec: dict = Field(default_factory=dict)


class ChartResponse(BaseModel):
    id: uuid.UUID
    query_result_id: uuid.UUID
    title: str
    chart_type: str
    chart_spec: dict
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InsightCreate(BaseModel):
    query_result_id: Optional[uuid.UUID] = None
    title: str = Field(..., max_length=255)
    summary: str
    details: dict = Field(default_factory=dict)


class InsightResponse(BaseModel):
    id: uuid.UUID
    query_result_id: Optional[uuid.UUID] = None
    title: str
    summary: str
    details: dict
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LineageEdgeResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    source_type: str
    source_id: uuid.UUID
    target_type: str
    target_id: uuid.UUID
    edge_type: str
    metadata_json: dict
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LineageGraphResponse(BaseModel):
    project_id: uuid.UUID
    edges: List[LineageEdgeResponse]
    node_count: int
    edge_count: int
