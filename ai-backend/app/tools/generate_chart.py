"""AskBase AI Backend - generate_chart tool.

Returns structured ECharts-compatible chart specifications.
The frontend is responsible for rendering — this tool only produces config.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger("askbase")

SUPPORTED_CHART_TYPES = {"bar", "line", "pie", "scatter", "table"}


def generate_chart(
    data: dict[str, Any],
    chart_type: str = "bar",
    options: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Produce a chart specification from query result data.

    Args:
        data: Result dict with keys: columns, rows, row_count, truncated.
        chart_type: One of bar, line, pie, scatter, table.
        options: Optional overrides (title, x_axis, y_axis, series_name, ...).

    Returns:
        Structured chart spec for ECharts:
        {
            "type": "bar",
            "title": "...",
            "x_axis": "...",
            "y_axis": "...",
            "x_data": [...],
            "series": [{"name": "...", "data": [...]}],
            "options": {...},
            "is_table": false
        }

        For "table" type:
        {
            "type": "table",
            "columns": [...],
            "rows": [...],
            "is_table": true
        }
    """
    if chart_type not in SUPPORTED_CHART_TYPES:
        chart_type = "bar"

    options = options or {}

    columns = data.get("columns", [])
    rows = data.get("rows", [])
    row_count = data.get("row_count", 0)

    if chart_type == "table" or row_count == 0:
        return {
            "type": "table",
            "columns": columns,
            "rows": rows,
            "row_count": row_count,
            "is_table": True,
        }

    # Heuristic mapping if no explicit axes provided
    x_axis = options.get("x_axis", columns[0] if columns else "")
    y_axis = options.get("y_axis", _guess_numeric_column(columns) or (columns[1] if len(columns) > 1 else ""))
    title = options.get("title", f"{y_axis} by {x_axis}" if x_axis and y_axis else "Chart")
    series_name = options.get("series_name", y_axis)

    # Build data series
    if chart_type in {"bar", "line", "scatter"}:
        x_data = [str(r[columns.index(x_axis)]) if x_axis in columns else str(i) for i, r in enumerate(rows)]
        y_idx = columns.index(y_axis) if y_axis in columns else 1
        series_data = [r[y_idx] if y_idx < len(r) else 0 for r in rows]

        if chart_type == "scatter":
            # Scatter: list of [x, y] pairs
            x_idx = columns.index(x_axis) if x_axis in columns else 0
            y_idx = columns.index(y_axis) if y_axis in columns else 1
            scatter_data = [
                [r[x_idx] if x_idx < len(r) else 0, r[y_idx] if y_idx < len(r) else 0]
                for r in rows
            ]
            return {
                "type": chart_type,
                "title": title,
                "x_axis": x_axis,
                "y_axis": y_axis,
                "x_data": x_data,
                "series": [{"name": series_name, "data": scatter_data}],
                "is_table": False,
                "options": options,
            }

        return {
            "type": chart_type,
            "title": title,
            "x_axis": x_axis,
            "y_axis": y_axis,
            "x_data": x_data,
            "series": [{"name": series_name, "data": series_data}],
            "is_table": False,
            "options": options,
        }

    return {
        "type": chart_type,
        "title": title,
        "x_axis": x_axis,
        "y_axis": y_axis,
        "x_data": [],
        "series": [],
        "is_table": False,
        "options": options,
    }


def _guess_numeric_column(columns: list[str]) -> str | None:
    """Return the first column name that looks numeric, or None."""
    numeric_indicators = ("amount", "price", "revenue", "count", "total", "sum", "avg", "value", "cost", "sales", "qty", "quantity")
    for col in columns:
        col_lower = col.lower()
        if any(ind in col_lower for ind in numeric_indicators):
            return col
    return None
