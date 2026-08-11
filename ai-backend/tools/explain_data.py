"""AskBase AI Backend - explain_data tool.

Uses Gemini to analyze query results and produce grounded insights.

CRITICAL RULES:
- Never invent data not present in the result set.
- If the data does not support a finding, say so explicitly.
- Distinguish facts from assumptions.
"""
from __future__ import annotations

import logging
from typing import Any

from app.services.gemini import get_gemini_service
from app.agent.prompts import DATA_ANALYSIS_PROMPT
from app.config import settings

logger = logging.getLogger("askbase")


async def explain_data(
 question: str,
 sql: str,
 data: dict[str, Any],
) -> dict[str, Any]:
 """Analyze SQL result data and return structured insights.

 Args:
 question: Original user question.
 sql: The SQL that produced the data.
 data: Result dict with keys: columns, rows, row_count, truncated.

 Returns:
 {
 "summary": "...",
 "key_insights": ["...", ...],
 "trends": ["...", ...],
 "anomalies": ["...", ...],
 "comparisons": ["...", ...],
 "business_meaning": "...",
 "recommendations": ["...", ...],
 "data_quality_notes": ["...", ...],
 }
 """
 if not data.get("rows"):
 return {
 "summary": "No data returned by the query.",
 "key_insights": [],
 "trends": [],
 "anomalies": [],
 "comparisons": [],
 "business_meaning": "",
 "recommendations": [],
 "data_quality_notes": ["Query returned zero rows."],
 }

 service = get_gemini_service()
 if not service.enabled:
 logger.info("Gemini not configured — returning basic analysis without AI insights.")
 return _fallback_analysis(question, sql, data)

 # Build a compact data representation for the prompt
 sample_rows = data["rows"][:20]
 column_names = data["columns"]

 data_preview = "\n".join(
 " | ".join(str(v) for v in row) for row in sample_rows
 )

 prompt = DATA_ANALYSIS_PROMPT.format(
 question=question,
 sql=sql,
 column_names=", ".join(column_names),
 row_count=data["row_count"],
 truncated=data.get("truncated", False),
 data_preview=data_preview,
 )

 try:
 response = await service.generate_structured(
 prompt=prompt,
 response_schema={
 "type": "object",
 "properties": {
 "summary": {"type": "string"},
 "key_insights": {"type": "array", "items": {"type": "string"}},
 "trends": {"type": "array", "items": {"type": "string"}},
 "anomalies": {"type": "array", "items": {"type": "string"}},
 "comparisons": {"type": "array", "items": {"type": "string"}},
 "business_meaning": {"type": "string"},
 "recommendations": {"type": "array", "items": {"type": "string"}},
 "data_quality_notes": {"type": "array", "items": {"type": "string"}},
 },
 "required": ["summary", "key_insights"],
 },
 )
 return response

 except Exception:
 logger.exception("Gemini analysis failed — returning fallback.")
 return _fallback_analysis(question, sql, data)


def _fallback_analysis(question: str, sql: str, data: dict[str, Any]) -> dict[str, Any]:
 """Basic analysis without AI — always safe, never invents facts."""
 columns = data["columns"]
 row_count = data["row_count"]
 truncated = data.get("truncated", False)

 notes = [f"Query returned {row_count} row(s)."]
 if truncated:
 notes.append(f"Results were truncated to {settings.QUERY_MAX_ROWS} rows.")

 return {
 "summary": f"The query returned {row_count} row(s) across {len(columns)} column(s).",
 "key_insights": [],
 "trends": [],
 "anomalies": [],
 "comparisons": [],
 "business_meaning": "Enable Gemini for AI-powered insights.",
 "recommendations": [],
 "data_quality_notes": notes,
 }
