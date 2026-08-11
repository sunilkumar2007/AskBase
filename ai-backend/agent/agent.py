"""AskBase AI Backend - Main Agent Orchestrator.

The Agent class coordinates the full pipeline:
 question → schema lookup → SQL generation → validation → execution → explanation → chart

Skills are composed in sequence. Each skill receives the context and
returns structured output. The context accumulates state across turns.
"""
from __future__ import annotations

import logging
import time
from typing import Any

from app.agent.context import AgentContext, QueryTurn
from app.agent.sql_skill import SQLSkill
from app.agent.chart_skill import ChartSkill
from app.agent.report_skill import ReportSkill
from app.agent.prompts import SYSTEM_PROMPT, AUTOPILOT_PROMPT
from app.services.gemini import get_gemini_service
from app.security.sql_validator import validate_sql
from app.database.queries import execute_select
from app.tools.explain_data import explain_data
from app.tools.get_schema import get_schema
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger("askbase")


class Agent:
 """Coordinates the full analytics pipeline."""

 def __init__(self):
 self.sql_skill = SQLSkill()
 self.chart_skill = ChartSkill()
 self.report_skill = ReportSkill()
 self._gemini = get_gemini_service()

 # ── Core pipeline ───────────────────────────────────────────────────────────

 async def process_question(
 self,
 session: AsyncSession,
 context: AgentContext,
 question: str,
 force_chart: bool = False,
 ) -> dict[str, Any]:
 """Full pipeline: question → answer with SQL, data, and optional chart.

 Args:
 session: Active DB session.
 context: Conversation context.
 question: User's question.

 Returns:
 {
 "answer": "...",
 "sql": "SELECT ...",
 "data": {"columns": [...], "rows": [...], "row_count": int, "truncated": bool},
 "chart": {...} | None,
 "explanation": {...} | None,
 "follow_up": "...",
 "error": null | "NO_SCHEMA" | "AI_DISABLED" | ...
 }
 """
 start = time.perf_counter()
 context.add_message("user", question)

 # ── Ensure schema is available ─────────────────────────────────────────────
 if not context.schema.get("tables"):
 try:
 context.schema = await get_schema(session)
 except Exception:
 logger.exception("Failed to load schema.")
 context.schema = {"tables": []}

 if not context.schema.get("tables"):
 return _error_response("NO_SCHEMA", "No database connected or schema is empty.", question, start)

 # ── Step 1: Generate SQL ────────────────────────────────────────────────────
 sql_result = await self.sql_skill.execute(context, {"question": question, "schema": context.schema})
 sql = sql_result.get("sql", "")
 if not sql:
 return _error_response(
 sql_result.get("error", "GENERATION_FAILED"),
 sql_result.get("explanation", "Could not generate SQL."),
 question,
 start,
 )

 # ── Step 2: Execute query ───────────────────────────────────────────────────
 try:
 data = await execute_select(session, sql)
 except Exception as exc:
 logger.error("Query execution failed: %s", exc)
 return {
 "answer": f"Query failed: {exc}",
 "sql": sql,
 "data": {"columns": [], "rows": [], "row_count": 0, "truncated": False},
 "chart": None,
 "explanation": None,
 "follow_up": "Try simplifying your question or check the data availability.",
 "error": "QUERY_FAILED",
 "elapsed_ms": round((time.perf_counter() - start) * 1000),
 }

 # ── Step 3: Explain data ────────────────────────────────────────────────────
 explanation = None
 try:
 explanation = await explain_data(question=question, sql=sql, data=data)
 except Exception:
 logger.exception("Data explanation failed.")

 # ── Step 4: Chart (if applicable) ──────────────────────────────────────────
 chart = None
 needs_chart = force_chart or (explanation.get("key_insights"))
 if data.get("rows") and needs_chart:
 try:
 chart = await self.chart_skill.execute(context, {"data": data, "question": question})
 except Exception:
 logger.exception("Chart generation failed.")

 # ── Build answer ───────────────────────────────────────────────────────────
 answer = self._build_answer(question, data, explanation, sql)

 follow_up = ""
 if explanation:
 follow_up = explanation.get("recommendations", [""])[0] if explanation.get("recommendations") else ""

 # Record turn
 turn = QueryTurn(
 user_message=question,
 sql=sql,
 data=data,
 explanation=explanation or {},
 chart_type=chart.get("type", "") if chart else "",
 chart_spec=chart or {},
 )
 context.add_turn(turn)

 return {
 "answer": answer,
 "sql": sql,
 "data": data,
 "chart": chart,
 "explanation": explanation,
 "follow_up": follow_up,
 "error": None,
 "elapsed_ms": round((time.perf_counter() - start) * 1000),
 }

 # ── Autopilot ───────────────────────────────────────────────────────────────

 async def autopilot(
 self,
 session: AsyncSession,
 context: AgentContext,
 question: str,
 max_steps: int = 5,
 ) -> dict[str, Any]:
 """Run a multi-step analytics plan automatically."""
 context.add_message("user", f"[Autopilot] {question}")

 # Step 1: Plan
 plan_prompt = AUTOPILOT_PROMPT.format(question=question, schema=str(context.schema))
 plan = {}
 try:
 plan = await self._gemini.generate_structured(
 prompt=plan_prompt,
 response_schema={
 "type": "object",
 "properties": {
 "plan": {
 "type": "array",
 "items": {
 "type": "object",
 "properties": {
 "step": {"type": "integer"},
 "task": {"type": "string"},
 "purpose": {"type": "string"},
 "priority": {"type": "string"},
 },
 },
 },
 },
 "required": ["plan"],
 },
 )
 except Exception:
 logger.exception("Autopilot planning failed.")

 steps = plan.get("plan", [])[:max_steps]
 results: list[dict[str, Any]] = []

 for step in steps:
 task = step.get("task", "")
 result = await self.process_question(session, context, task)
 results.append({"step": step.get("step"), "task": task, "result": result})

 return {
 "question": question,
 "steps": steps,
 "results": results,
 "error": None,
 }

 # ── Helpers ─────────────────────────────────────────────────────────────────

 def _build_answer(self, question: str, data: dict[str, Any], explanation: Any, sql: str) -> str:
 """Synthesize a natural language answer from the pipeline results."""
 if explanation.get("summary"):
 return explanation["summary"]

 row_count = data.get("row_count", 0)
 columns = data.get("columns", [])
 return (
 f"I found {row_count} result(s) across {len(columns)} column(s). "
 f"The query was: {sql[:80]}..."
 if row_count > 0
 else "No results matched your question. Try rephrasing or broadening your criteria."
 )


def _error_response(error_code: str, message: str, question: str, start: float) -> dict[str, Any]:
 return {
 "answer": message,
 "sql": "",
 "data": {"columns": [], "rows": [], "row_count": 0, "truncated": False},
 "chart": None,
 "explanation": None,
 "follow_up": "",
 "error": error_code,
 "elapsed_ms": round((time.perf_counter() - start) * 1000),
 }


# ── Re-export ─────────────────────────────────────────────────────────────────
from app.agent.context import QueryTurn # noqa: E402
