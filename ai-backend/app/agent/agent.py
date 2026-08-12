"""AskBase AI Backend - Main Agent Orchestrator.

The Agent class coordinates the full pipeline:
  question → schema lookup → SQL generation → validation → execution → explanation → chart
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
        """Process a single natural-language question.

        Args:
            session: Active DB session.
            context: Conversation context.
            question: User's question.
            force_chart: Always generate a chart if possible.

        Returns:
            Structured response dict containing answer, sql, data, chart, etc.
        """
        start = time.perf_counter()
        context.add_message("user", question)

        # 1. Load schema if not already present in context
        if not context.schema.get("tables"):
            try:
                context.schema = await get_schema(session)
            except Exception:
                logger.exception("Failed to load schema.")
                context.schema = {"tables": []}

        if not context.schema.get("tables"):
            return _error_response("NO_SCHEMA", "No database connected or schema is empty.", question, start)

        # 2. Generate SQL via SQLSkill
        sql_result = await self.sql_skill.execute(context, {"question": question, "schema": context.schema})
        sql = sql_result.get("sql", "")
        if not sql:
            return _error_response(
                sql_result.get("error", "GENERATION_FAILED"),
                sql_result.get("explanation", "Could not generate SQL."),
                question,
                start,
            )

        # 3. Execute SQL safely
        try:
            data = await execute_select(session, sql)
        except Exception as exc:
            logger.error("Query execution failed: %s", exc)
            return {
                "answer": f"Query execution failed: {exc}",
                "sql": sql,
                "data": None,
                "chart": None,
                "explanation": None,
                "follow_up": "Would you like me to try rewriting the query?",
                "error": "EXECUTION_FAILED",
                "elapsed_ms": _ms(start),
            }

        # 4. Explain data / insights via Gemini
        explanation = None
        try:
            explanation = await explain_data(question=question, sql=sql, data=data)
        except Exception:
            logger.exception("Data explanation failed.")

        # 5. Generate chart if appropriate
        chart = None
        needs_chart = force_chart or (explanation.get("key_insights") if explanation else False)
        if data.get("rows") and needs_chart:
            try:
                chart = await self.chart_skill.execute(context, {"data": data, "question": question})
            except Exception:
                logger.exception("Chart generation failed.")

        # 6. Record turn in context
        answer_text = explanation.get("summary", "Data fetched successfully.") if explanation else "Data fetched successfully."
        context.add_turn(
            QueryTurn(
                user_question=question,
                generated_sql=sql,
                results_summary=answer_text,
            )
        )
        context.add_message("assistant", answer_text)

        return {
            "answer": answer_text,
            "sql": sql,
            "data": data,
            "chart": chart.get("chart_config") if chart else None,
            "explanation": explanation,
            "follow_up": explanation.get("follow_up_questions", "") if explanation else "",
            "error": None,
            "elapsed_ms": _ms(start),
        }

    # ── Autopilot mode ──────────────────────────────────────────────────────────

    async def autopilot(
        self,
        session: AsyncSession,
        context: AgentContext,
        goal: str,
        max_steps: int = 5,
    ) -> dict[str, Any]:
        """Multi-step autonomous investigation.

        Performs root cause analysis, hypothesis generation, and step-by-step
        query execution to answer high-level analytical questions.
        """
        start = time.perf_counter()
        if not self._gemini.enabled:
            return _error_response("LLM_DISABLED", "LLM is disabled.", goal, start)

        prompt = AUTOPILOT_PROMPT.format(goal=goal, schema=context.schema)
        try:
            plan = await self._gemini.generate_structured(
                prompt=prompt,
                system_instruction=SYSTEM_PROMPT,
            )
        except Exception as exc:
            return _error_response("PLANNING_FAILED", f"Autopilot planning failed: {exc}", goal, start)

        steps_taken = []
        for step_idx, step in enumerate(plan.get("steps", [])[:max_steps]):
            question = step.get("question", "")
            if not question:
                continue
            res = await self.process_question(session, context, question)
            steps_taken.append({"step": step_idx + 1, "question": question, "result": res})

        return {
            "goal": goal,
            "steps": steps_taken,
            "final_summary": plan.get("summary", "Autopilot investigation complete."),
            "elapsed_ms": _ms(start),
        }


def _error_response(code: str, message: str, question: str, start_time: float) -> dict[str, Any]:
    return {
        "answer": message,
        "sql": "",
        "data": None,
        "chart": None,
        "explanation": None,
        "follow_up": "",
        "error": code,
        "elapsed_ms": _ms(start_time),
    }


def _ms(start_time: float) -> int:
    return round((time.perf_counter() - start_time) * 1000)
