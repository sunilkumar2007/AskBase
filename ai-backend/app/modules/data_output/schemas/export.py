import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class ExportGenerateRequest(BaseModel):
    file_format: str = Field(..., pattern="^(csv|json|xlsx|pdf|pptx)$")
    export_type: str = Field("dataset", pattern="^(dataset|report|dashboard)$")
    title: Optional[str] = "ASKBASE Export"
    columns: List[str] = Field(default_factory=list)
    rows: List[List[Any]] = Field(default_factory=list)
    report_id: Optional[uuid.UUID] = None
    dashboard_id: Optional[uuid.UUID] = None
    options: Dict[str, Any] = Field(default_factory=dict)


class ExportResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    file_id: Optional[uuid.UUID] = None
    report_id: Optional[uuid.UUID] = None
    dashboard_id: Optional[uuid.UUID] = None
    export_type: str
    file_format: str
    file_size_bytes: int
    options_json: dict
    created_by: uuid.UUID
    created_at: datetime
    download_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ExportDownloadUrlResponse(BaseModel):
    export_id: uuid.UUID
    file_format: str
    download_url: str
    expires_in_seconds: int = 3600
