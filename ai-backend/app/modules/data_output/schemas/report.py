import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class ReportCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    content_structure: dict = Field(default_factory=dict)


class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    content_structure: Optional[dict] = None


class ReportExportRequest(BaseModel):
    file_format: str = Field("pdf", pattern="^(pdf|pptx|xlsx|csv|json)$")
    title: Optional[str] = None
    options: dict = Field(default_factory=dict)


class ReportResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    description: Optional[str] = None
    content_structure: dict
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportDetailResponse(ReportResponse):
    pass
