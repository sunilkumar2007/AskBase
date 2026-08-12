"""AskBase AI Backend - Reports routes.

Generate and retrieve analysis reports.
"""
from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.agent.agent import Agent
from app.agent.context import AgentContext
from app.agent.report_skill import ReportSkill
from app.api.dependencies import get_db, get_current_project, get_current_user
from app.modules.data_output.services.report_service import ReportService


logger = logging.getLogger("askbase")

router = APIRouter()


@router.post("/generate/{project_id}")
async def generate_report(
    payload: dict[str, Any],
    project: dict[str, Any] = Depends(get_current_project),
    session: AsyncSession = Depends(get_db),
    user_claims: dict[str, Any] = Depends(get_current_user),
):
    """Generate a structured report from analysis results."""
    question = payload.get("question", "")
    data_summary = payload.get("data_summary", "")
    insights = payload.get("insights", [])

    if not question:
        raise HTTPException(400, "Missing 'question'.")

    skill = ReportSkill()
    context = AgentContext(
        project_id=project["id"],
        user_id=user_claims.get("sub", ""),
    )
    result = await skill.execute(context, {
        "question": question,
        "data_summary": data_summary,
        "insights": insights,
        "charts": payload.get("charts", []),
        "format": payload.get("format", "markdown"),
    })
    return result


@router.get("/list/{project_id}")
async def list_reports(
    project_id: str,
    project: dict[str, Any] = Depends(get_current_project),
    session: AsyncSession = Depends(get_db),
):
    """List reports for a project."""
    service = ReportService(session)
    reports = await service.list_by_project(project_id)
    return {"reports": reports}


@router.get("/{report_id}")
async def get_report(
    report_id: str,
    project: dict[str, Any] = Depends(get_current_project),
    session: AsyncSession = Depends(get_db),
):
    """Get a single report."""
    service = ReportService(session)
    report = await service.get(report_id)
    if not report:
        raise HTTPException(404, "Report not found.")
    return report
