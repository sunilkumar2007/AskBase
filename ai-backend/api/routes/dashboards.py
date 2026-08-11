"""AskBase AI Backend - Dashboards routes.

Create and manage analytical dashboards.
"""
from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_current_project, get_current_user

logger = logging.getLogger("askbase")

router = APIRouter()


@router.post("/{project_id}")
async def create_dashboard(
 payload: dict[str, Any],
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
 user_claims: dict[str, Any] = Depends(get_current_user),
):
 """Create a new dashboard."""
 name = payload.get("name", "")
 config = payload.get("config", {})
 if not name:
 raise HTTPException(400, "Dashboard name is required.")

 try:
 result = await session.execute(
 """
 INSERT INTO dashboards (project_id, user_id, name, config)
 VALUES (:pid, :uid, :name, :cfg::jsonb)
 RETURNING id, name, config, created_at, updated_at
 """,
 {"pid": project["id"], "uid": user_claims.get("sub", ""), "name": name, "cfg": config},
 )
 row = result.mappings().first()
 await session.commit()
 return dict(row) if row else {}
 except Exception:
 logger.exception("Failed to create dashboard.")
 raise HTTPException(500, "Failed to create dashboard.")


@router.get("/{dashboard_id}")
async def get_dashboard(
 dashboard_id: str,
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
):
 """Get a dashboard by ID."""
 try:
 result = await session.execute(
 """
 SELECT id, name, config, created_at, updated_at
 FROM dashboards
 WHERE id = :did AND project_id = :pid
 """,
 {"did": dashboard_id, "pid": project["id"]},
 )
 row = result.mappings().first()
 if not row:
 raise HTTPException(404, "Dashboard not found.")
 return dict(row)
 except HTTPException:
 raise
 except Exception:
 logger.exception("Failed to get dashboard.")
 raise HTTPException(500, "Failed to get dashboard.")


@router.put("/{dashboard_id}")
async def update_dashboard(
 dashboard_id: str,
 payload: dict[str, Any],
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
):
 """Update a dashboard."""
 allowed = {"name", "config"}
 updates = {k: v for k, v in payload.items() if k in allowed}
 if not updates:
 raise HTTPException(400, "No valid fields to update.")

 set_clauses = ", ".join(f"{k} = :{k}" for k in updates)
 params = {**updates, "did": dashboard_id, "pid": project["id"]}
 try:
 result = await session.execute(
 f"""
 UPDATE dashboards
 SET {set_clauses}, updated_at = NOW()
 WHERE id = :did AND project_id = :pid
 RETURNING id, name, config, created_at, updated_at
 """,
 params,
 )
 row = result.mappings().first()
 await session.commit()
 if not row:
 raise HTTPException(404, "Dashboard not found.")
 return dict(row)
 except HTTPException:
 raise
 except Exception:
 logger.exception("Failed to update dashboard.")
 raise HTTPException(500, "Failed to update dashboard.")


@router.delete("/{dashboard_id}")
async def delete_dashboard(
 dashboard_id: str,
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
):
 """Delete a dashboard."""
 try:
 await session.execute(
 """
 DELETE FROM dashboards WHERE id = :did AND project_id = :pid
 """,
 {"did": dashboard_id, "pid": project["id"]},
 )
 await session.commit()
 return {"deleted": True}
 except Exception:
 logger.exception("Failed to delete dashboard.")
 raise HTTPException(500, "Failed to delete dashboard.")
