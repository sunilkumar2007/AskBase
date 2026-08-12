"""AskBase AI Backend - Chart Recommendation Skill.

Decides the best chart type for a dataset and produces
a structured ECharts-compatible chart specification.
"""
from __future__ import annotations

import logging
from typing import Any

from app.agent.base_skill import BaseSkill
from app.agent.context import AgentContext
from app.agent.prompts import CHART_PROMPT
from app.services.gemini import get_gemini_service
from app.tools.generate_chart import generate_chart, SUPPORTED_CHART_TYPES

logger = logging.getLogger("askbase")


class ChartSkill(BaseSkill):
    name = "chart_generation"
    description = "Recommend and generate a chart specification for query results."
    required_params = ["data"]
    optional_params = ["question", "chart_type", "options"]

    async def execute(self, context: AgentContext, params: dict[str, Any]) -> dict[str, Any]:
        self.validate_params(params)

        data = params["data"]
        rows = data.get("rows", [])
        columns = data.get("columns", [])

        if not rows or not columns:
            return {"type": "table", "columns": columns, "rows": rows, "is_table": True}

        # If caller already specified a chart type, use it
        forced_type = params.get("chart_type")
        if forced_type in SUPPORTED_CHART_TYPES:
            return generate_chart(data, chart_type=forced_type, options=params.get("options"))

        # Use Gemini to pick the best chart type
        question = params.get("question", "")
        spec = await _recommend_chart(question, data)
        if spec:
            return spec

        # Fallback: heuristic selection
        return generate_chart(data, options=params.get("options"))


async def _recommend_chart(question: str, data: dict[str, Any]) -> dict[str, Any] | None:
    service = get_gemini_service()
    if not service.enabled:
        return None

    columns = data.get("columns", [])
    rows = data.get("rows", [])
    row_count = data.get("row_count", 0)
    first_row = rows[0] if rows else []

    prompt = CHART_PROMPT.format(
        question=question,
        column_names=", ".join(columns),
        row_count=row_count,
        first_row=" | ".join(str(v) for v in first_row),
    )

    try:
        response = await service.generate_structured(
            prompt=prompt,
            response_schema={
                "type": "object",
                "properties": {
                    "chart_type": {"type": "string", "enum": list(SUPPORTED_CHART_TYPES)},
                    "reason": {"type": "string"},
                    "x_axis": {"type": "string"},
                    "y_axis": {"type": "string"},
                    "series_name": {"type": "string"},
                },
                "required": ["chart_type", "x_axis", "y_axis"],
            },
        )
        chart_type = response.get("chart_type", "bar")
        options = {
            "title": response.get("reason", ""),
            "x_axis": response.get("x_axis", columns[0] if columns else ""),
            "y_axis": response.get("y_axis", ""),
            "series_name": response.get("series_name", ""),
        }
        return generate_chart(data, chart_type=chart_type, options=options)

    except Exception:
        logger.exception("Chart recommendation failed.")
        return None
