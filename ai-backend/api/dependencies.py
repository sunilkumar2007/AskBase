"""AskBase AI Backend - API Dependencies.

Shared FastAPI dependencies: database sessions, authentication,
project access checks.
"""
from __future__ import annotations

import logging
from typing import Any, AsyncGenerator

from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_session
from app.security.auth import verify_supabase_token, extract_user_id
from app.services.project_service import ProjectService

logger = logging.getLogger("askbase")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
 """FastAPI dependency — yields a database session per request."""
 async for session in get_session():
 yield session


async def get_current_user(
 authorization: str = Header(..., alias="Authorization"),
) -> dict[str, Any]:
 """FastAPI dependency — extracts and verifies the Supabase JWT user."""
 if not authorization:
 raise HTTPException(
 status_code=status.HTTP_401_UNAUTHORIZED,
 detail="Missing Authorization header.",
 headers={"WWW-Authenticate": "Bearer"},
 )

 claims = await verify_supabase_token(authorization)
 if not claims:
 raise HTTPException(
 status_code=status.HTTP_401_UNAUTHORIZED,
 detail="Invalid or expired token.",
 headers={"WWW-Authenticate": "Bearer"},
 )

 return claims


async def get_current_project(
 project_id: str,
 session: AsyncSession = Depends(get_db),
 user_claims: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
 """FastAPI dependency — verifies the user can access the given project."""
 user_id = extract_user_id(user_claims)
 if not user_id:
 raise HTTPException(status_code=401, detail="Invalid user token.")

 service = ProjectService(session)
 project = await service.get(project_id)
 if not project:
 raise HTTPException(status_code=404, detail="Project not found.")

 if project.get("user_id") != user_id:
 raise HTTPException(status_code=403, detail="You do not have access to this project.")

 return project
