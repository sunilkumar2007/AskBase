"""AskBase AI Backend - Shared Pydantic Schemas.

Request/response models for all API endpoints.
Used for validation, serialization, and OpenAPI docs.
"""
from __future__ import annotations

from pydantic import BaseModel, Field, HttpUrl


# ── Projects ─────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
 name: str = Field(..., min_length=1, max_length=255)
 description: str = Field(default="", max_length=5000)
 database_url: str = Field(default="")


class ProjectUpdate(BaseModel):
 name: str | None = Field(default=None, max_length=255)
 description: str | None = Field(default=None, max_length=5000)
 database_url: str | None = Field(default=None)


class ProjectResponse(BaseModel):
 id: str
 user_id: str
 name: str
 description: str | None
 database_url: str | None
 created_at: str
 updated_at: str


class ConnectionTestRequest(BaseModel):
 database_url: str


class ConnectionTestResponse(BaseModel):
 connected: bool
 version: str | None
 error: str | None


# ── Chat ─────────────────────────────────────────────────────────────────────

class ChatMessageRequest(BaseModel):
 message: str = Field(..., min_length=1)
 project_id: str = Field(...)


class ChatMessageResponse(BaseModel):
 answer: str
 sql: str
 data: dict
 chart: dict | None
 explanation: dict | None
 follow_up: str
 error: str | None


# ── Reports ──────────────────────────────────────────────────────────────────

class ReportGenerateRequest(BaseModel):
 question: str = Field(..., min_length=1)
 data_summary: str = Field(default="")
 insights: list[str] = Field(default_factory=list)
 charts: list[dict] = Field(default_factory=list)
 format: str = Field(default="markdown")


class ReportResponse(BaseModel):
 title: str
 executive_summary: str
 sections: list[dict]
 charts: list[dict]
 insights: list[str]
 recommendations: list[str]
 format: str


# ── Dashboards ───────────────────────────────────────────────────────────────

class DashboardCreate(BaseModel):
 name: str = Field(..., min_length=1, max_length=255)
 config: dict = Field(default_factory=dict)


class DashboardUpdate(BaseModel):
 name: str | None = Field(default=None, max_length=255)
 config: dict | None = Field(default=None)


class DashboardResponse(BaseModel):
 id: str
 project_id: str
 user_id: str
 name: str
 config: dict | None
 created_at: str
 updated_at: str


# ── Agent / Autopilot ────────────────────────────────────────────────────────

class AutopilotRequest(BaseModel):
 question: str = Field(..., min_length=1)
 max_steps: int = Field(default=5, ge=1, le=20)


class RootCauseRequest(BaseModel):
 anomaly: str = Field(..., min_length=1)


# ── Files ────────────────────────────────────────────────────────────────────

class FileUploadResponse(BaseModel):
 file_id: str
 filename: str
 path: str


# ── Common ───────────────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
 error: str
 message: str
 detail: str | None = None
