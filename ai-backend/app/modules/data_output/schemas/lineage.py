import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class LineageNode(BaseModel):
    id: uuid.UUID
    type: str
    label: str
    metadata: dict = Field(default_factory=dict)


class LineageEdge(BaseModel):
    id: uuid.UUID
    source_type: str
    source_id: uuid.UUID
    target_type: str
    target_id: uuid.UUID
    edge_type: str
    metadata: dict = Field(default_factory=dict)


class LineageGraphResponse(BaseModel):
    project_id: uuid.UUID
    nodes: List[LineageNode]
    edges: List[LineageEdge]
