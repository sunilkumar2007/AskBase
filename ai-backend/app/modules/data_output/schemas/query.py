import uuid
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, Field


class QueryExecuteRequest(BaseModel):
    raw_sql: str
    chat_id: Optional[uuid.UUID] = None
    dialect: str = "postgres"
    parameters: dict = Field(default_factory=dict)


class QueryResultResponse(BaseModel):
    id: uuid.UUID
    query_id: uuid.UUID
    status: str
    row_count: int
    execution_time_ms: float
    columns_schema: dict
    error_message: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QueryResultDataResponse(BaseModel):
    id: uuid.UUID
    query_id: uuid.UUID
    columns: List[str]
    rows: List[List[Any]]
    row_count: int
    execution_time_ms: float
    is_truncated: bool = False


class QueryResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    raw_sql: str
    compiled_sql: str
    dialect: str
    is_read_only: bool
    chat_id: Optional[uuid.UUID] = None
    created_by: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QueryHistoryResponse(BaseModel):
    items: List[QueryResponse]
    total_count: int
    page: int
    page_size: int


class SavedQueryCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    sql_template: str
    parameters_schema: dict = Field(default_factory=dict)


class SavedQueryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    sql_template: Optional[str] = None
    parameters_schema: Optional[dict] = None


class SavedQueryResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    name: str
    description: Optional[str] = None
    sql_template: str
    parameters_schema: dict
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
