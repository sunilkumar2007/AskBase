import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class ChatCreate(BaseModel):
    title: Optional[str] = "New Conversation"


class ChatResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageCreate(BaseModel):
    sender_role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str
    metadata_json: dict = Field(default_factory=dict)


class MessageResponse(BaseModel):
    id: uuid.UUID
    chat_id: uuid.UUID
    sender_role: str
    content: str
    metadata_json: dict
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
