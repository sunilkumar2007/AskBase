"""AskBase AI Backend - Report Generation Skill.

Produces a structured Markdown/HTML report from analysis results,
insights, and charts. Used by the reports endpoint.
"""
from __future__ import annotations

import logging
from typing import Any

from app.agent.base_skill import BaseSkill
from app.agent.context import AgentContext
from app.agent.prompts import REPORT_PROMPT
from app.services.gemini import get_gemini_service

logger = logging.getLogger("askbase")


class ReportSkill(BaseSkill):
 name = "report_generation"
 description = "Generate a structured analysis report."
 required_params = ["question", "data_summary", "insights"]
 optional_params = ["charts", "format"]

 async def execute(self, context: AgentContext, params: dict[str, Any]) -> dict[str, Any]:
 self.validate_params(params)

 question = params["question"]
 data_summary = params["data_summary"]
 insights = params["insights"]
 charts = params.get("charts", [])
 fmt = params.get("format", "markdown")

 service = get_gemini_service()
 if not service.enabled:
 logger.warning("Gemini disabled — returning basic report.")
 return _basic_report(question, data_summary, insights, charts, fmt)

 prompt = REPORT_PROMPT.format(
 question=question,
 data_summary=str(data_summary),
 insights=str(insights),
 )

 try:
 response = await service.generate_structured(
 prompt=prompt,
 response_schema={
 "type": "object",
 "properties": {
 "title": {"type": "string"},
 "executive_summary": {"type": "string"},
 "sections": {
 "type": "array",
 "items": {
 "type": "object",
 "properties": {
 "title": {"type": "string"},
 "content": {"type": "string"},
 },
 },
 },
 "charts": {
 "type": "array",
 "items": {
 "type": "object",
 "properties": {
 "type": {"type": "string"},
 "title": {"type": "string"},
 "description": {"type": "string"},
 },
 },
 },
 "insights": {"type": "array", "items": {"type": "string"}},
 "recommendations": {"type": "array", "items": {"type": "string"}},
 },
 "required": ["title", "executive_summary"],
 },
 )

 response["format"] = fmt
 response["charts"] = response.get("charts", []) + charts
 return response

 except Exception:
 logger.exception("Report generation failed.")
 return _basic_report(question, data_summary, insights, charts, fmt)


def _basic_report(
 question: str, data_summary: Any, insights: Any, charts: list, fmt: str
) -> dict[str, Any]:
 """Fallback report without AI — just wraps the data in a simple structure."""
 return {
 "title": f"Report: {question}",
 "executive_summary": str(data_summary),
 "sections": [
 {"title": "Insights", "content": "\n".join(insights) if isinstance(insights, list) else str(insights)},
 ],
 "charts": charts,
 "insights": insights if isinstance(insights, list) else [str(insights)],
 "recommendations": [],
 "format": fmt,
 }
