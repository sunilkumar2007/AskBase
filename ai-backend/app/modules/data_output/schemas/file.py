import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class FileResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    filename: str
    storage_path: str
    bucket_name: str
    mime_type: str
    file_size_bytes: int
    checksum: Optional[str] = None
    metadata_json: dict
    created_by: Optional[uuid.UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FileDownloadUrlResponse(BaseModel):
    file_id: uuid.UUID
    filename: str
    download_url: str
    expires_at: Optional[datetime] = None
