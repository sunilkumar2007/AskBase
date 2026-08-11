"""AskBase AI Backend - Project Service.

Business logic for project CRUD and database connection management.
"""
from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger("askbase")


class ProjectService:
 """Project CRUD and connection management."""

 def __init__(self, session: AsyncSession):
 self.session = session

 # ── CRUD ───────────────────────────────────────────────────────────────────

 async def list_by_user(self, user_id: str) -> list[dict[str, Any]]:
 """List all projects for a given user."""
 try:
 result = await self.session.execute(
 """
 SELECT id, name, description, database_url, created_at, updated_at
 FROM projects
 WHERE user_id = :uid
 ORDER BY updated_at DESC
 """,
 {"uid": user_id},
 )
 rows = result.mappings().fetchall()
 return [dict(r) for r in rows]
 except Exception:
 logger.exception("Failed to list projects for user %s", user_id)
 return []


 async def create(self, user_id: str, name: str, description: str = "", database_url: str = "") -> dict[str, Any] | None:
 """Create a new project."""
 try:
 result = await self.session.execute(
 """
 INSERT INTO projects (user_id, name, description, database_url)
 VALUES (:uid, :name, :desc, :dburl)
 RETURNING id, name, description, database_url, created_at, updated_at
 """,
 {"uid": user_id, "name": name, "desc": description, "dburl": database_url},
 )
 row = result.mappings().first()
 await self.session.commit()
 return dict(row) if row else None
 except Exception:
 logger.exception("Failed to create project.")
 await self.session.rollback()
 return None


 async def get(self, project_id: str) -> dict[str, Any] | None:
 """Get a single project by ID."""
 try:
 result = await self.session.execute(
 """
 SELECT id, name, description, database_url, created_at, updated_at
 FROM projects
 WHERE id = :pid
 """,
 {"pid": project_id},
 )
 row = result.mappings().first()
 return dict(row) if row else None
 except Exception:
 logger.exception("Failed to get project %s", project_id)
 return None


 async def update(self, project_id: str, **updates) -> dict[str, Any] | None:
 """Update project fields."""
 if not updates:
 return await self.get(project_id)

 set_clauses = ", ".join(f"{k} = :{k}" for k in updates)
 params = {**updates, "pid": project_id}
 try:
 result = await self.session.execute(
 f"""
 UPDATE projects
 SET {set_clauses}, updated_at = NOW()
 WHERE id = :pid
 RETURNING id, name, description, database_url, created_at, updated_at
 """,
 params,
 )
 row = result.mappings().first()
 await self.session.commit()
 return dict(row) if row else None
 except Exception:
 logger.exception("Failed to update project %s", project_id)
 await self.session.rollback()
 return None


 async def delete(self, project_id: str) -> bool:
 """Delete a project and its associated data."""
 try:
 await self.session.execute(
 """
 DELETE FROM chat_sessions WHERE project_id = :pid;
 DELETE FROM projects WHERE id = :pid;
 """,
 {"pid": project_id},
 )
 await self.session.commit()
 return True
 except Exception:
 logger.exception("Failed to delete project %s", project_id)
 await self.session.rollback()
 return False

 # ── Connection testing ─────────────────────────────────────────────────────

 async def test_connection(self, database_url: str) -> dict[str, Any]:
 """Test a database connection and return status."""
 try:
 from sqlalchemy.ext.asyncio import create_async_engine
 from sqlalchemy.pool import NullPool

 engine = create_async_engine(database_url, poolclass=NullPool, pool_pre_ping=True)
 try:
 async with engine.connect() as conn:
 result = await conn.execute(text("SELECT 1"))
 version_row = await conn.execute(text("SELECT version()"))
 version = version_row.scalar()
 return {
 "connected": True,
 "version": version,
 "error": None,
 }
 except Exception as exc:
 return {
 "connected": False,
 "version": None,
 "error": str(exc),
 }
 finally:
 await engine.dispose()
 except Exception as exc:
 logger.exception("Connection test failed.")
 return {"connected": False, "version": None, "error": str(exc)}
