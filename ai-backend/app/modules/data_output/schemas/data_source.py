import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class DataSourceCreate(BaseModel):
    name: str = Field(..., max_length=255)
    type: str = Field(..., max_length=50)  # postgresql, duckdb, csv, excel
    connection_config_encrypted: Optional[str] = None
    schema_metadata: dict = Field(default_factory=dict)


class DataSourceResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    name: str
    type: str
    schema_metadata: dict
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
