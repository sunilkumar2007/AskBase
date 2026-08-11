"""AskBase AI Backend - Agent routes.

Advanced analytics: autopilot, root cause analysis, schema inspection.
"""
from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.agent.agent import Agent
from app.agent.context import AgentContext
from app.api.dependencies import get_db, get_current_user, get_current_project
from app.tools.get_schema import get_schema

logger = logging.getLogger("askbase")

router = APIRouter()
_agent = Agent()


@router.post("/autopilot/{project_id}")
async def autopilot(
 payload: dict[str, Any],
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
 user_claims: dict[str, Any] = Depends(get_current_user),
 ):
 """Run a multi-step autopilot analysis."""
 question = payload.get("question", "")
 if not question:
 raise HTTPException(400, "Missing 'question'.")

 context = AgentContext(
 project_id=project["id"],
 user_id=user_claims.get("sub", ""),
 database_url=project.get("database_url", ""),
 )

 # Load schema
 context.schema = await get_schema(session)

 result = await _agent.autopilot(session, context, question, max_steps=payload.get("max_steps", 5))
 return result


@router.post("/root-cause/{project_id}")
async def root_cause_analysis(
 payload: dict[str, Any],
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
 user_claims: dict[str, Any] = Depends(get_current_user),
 ):
 """Perform root-cause analysis on an anomaly."""
 anomaly = payload.get("anomaly", "")
 if not anomaly:
 raise HTTPException(400, "Missing 'anomaly' description.")

 context = AgentContext(
 project_id=project["id"],
 user_id=user_claims.get("sub", ""),
 database_url=project.get("database_url", ""),
 )
 context.schema = await get_schema(session)

 # Use Gemini root-cause prompt via the agent
 from app.services.gemini import get_gemini_service
 service = get_gemini_service()
 if not service.enabled:
 raise HTTPException(503, "AI service not configured.")

 result = await service.generate_structured(
 prompt=f"Anomaly: {anomaly}\nSchema: {context.schema}\nFind root causes.",
 response_schema={
 "type": "object",
 "properties": {
 "hypotheses": {
 "type": "array",
 "items": {
 "type": "object",
 "properties": {
 "description": {"type": "string"},
 "plausibility": {"type": "string", "enum": ["high", "medium", "low"]},
 "evidence": {"type": "string"},
 "suggested_queries": {"type": "array", "items": {"type": "string"}},
 },
 },
 },
 "next_steps": {"type": "array", "items": {"type": "string"}},
 "insufficient_data": {"type": "boolean"},
 },
 "required": ["hypotheses"],
 },
 )
 return result


@router.get("/schema/{project_id}")
async def get_project_schema(
 project: dict[str, Any] = Depends(get_current_project),
 session: AsyncSession = Depends(get_db),
):
 """Return the database schema for a project."""
 schema = await get_schema(session)
 return schema
