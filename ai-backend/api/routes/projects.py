"""AskBase AI Backend - Projects routes.

Project CRUD, database connection testing, and management.
"""
from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_current_user
from app.services.project_service import ProjectService

logger = logging.getLogger("askbase")

router = APIRouter()


@router.get("/")
async def list_projects(
 user_claims: dict[str, Any] = Depends(get_current_user),
 session: AsyncSession = Depends(get_db),
 ):
 """List all projects for the authenticated user."""
 service = ProjectService(session)
 projects = await service.list_by_user(user_claims.get("sub", ""))
 return {"projects": projects}


@router.post("/")
async def create_project(
 payload: dict[str, Any],
 user_claims: dict[str, Any] = Depends(get_current_user),
 session: AsyncSession = Depends(get_db),
 ):
 """Create a new project."""
 name = payload.get("name", "")
 description = payload.get("description", "")
 database_url = payload.get("database_url", "")

 if not name:
 raise HTTPException(400, "Project name is required.")

 service = ProjectService(session)
 project = await service.create(
 user_id=user_claims.get("sub", ""),
 name=name,
 description=description,
 database_url=database_url,
 )
 if not project:
 raise HTTPException(500, "Failed to create project.")
 return project


@router.get("/{project_id}")
async def get_project(
 project_id: str,
 project: dict[str, Any] = Depends(get_current_project),
):
 """Get a single project."""
 return project


@router.put("/{project_id}")
async def update_project(
 project_id: str,
 payload: dict[str, Any],
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
 ):
 """Update a project."""
 allowed = {"name", "description", "database_url"}
 updates = {k: v for k, v in payload.items() if k in allowed}
 if not updates:
 raise HTTPException(400, "No valid fields to update.")

 service = ProjectService(session)
 updated = await service.update(project_id, **updates)
 if not updated:
 raise HTTPException(500, "Failed to update project.")
 return updated


@router.delete("/{project_id}")
async def delete_project(
 project_id: str,
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
 ):
 """Delete a project."""
 service = ProjectService(session)
 success = await service.delete(project_id)
 if not success:
 raise HTTPException(500, "Failed to delete project.")
 return {"deleted": True}


@router.post("/{project_id}/test-connection")
async def test_connection(
 project_id: str,
 payload: dict[str, Any],
 project: dict[str, Any] = Depends(get_current_project),
):
 """Test a database connection string."""
 database_url = payload.get("database_url", project.get("database_url", ""))
 if not database_url:
 raise HTTPException(400, "No database URL provided.")

 from app.services.project_service import ProjectService
 service = ProjectService(None)
 result = await service.test_connection(database_url)
 return result
