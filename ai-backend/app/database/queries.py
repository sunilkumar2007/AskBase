"""AskBase AI Backend - Reusable Query Execution Layer.

Provides a safe, reusable wrapper around SQLAlchemy async query execution
with row limits, timeout control, and structured result formatting.
"""
from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import text
from sqlalchemy.exc import OperationalError, ProgrammingError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings

logger = logging.getLogger("askbase")


async def execute_select(
    session: AsyncSession,
    sql: str,
    params: dict[str, Any] | None = None,
    max_rows: int | None = None,
) -> dict[str, Any]:
    """Execute a SELECT query and return structured result data.

    Args:
        session: Active SQLAlchemy async session.
        sql: Validated SELECT SQL string.
        params: Optional bound parameters dict.
        max_rows: Override default row limit.

    Returns:
        {
            "columns": ["col1", "col2", ...],
            "rows": [[...], [...], ...],
            "row_count": int,
            "truncated": bool,
        }
    """
    max_rows = max_rows or settings.QUERY_MAX_ROWS
    try:
        result = await session.execute(text(sql), params or {})
        rows = result.mappings().fetchall()
        truncated = len(rows) >= max_rows

        if truncated:
            limited = rows[:max_rows]
        else:
            limited = rows

        if not limited:
            return {"columns": [], "rows": [], "row_count": 0, "truncated": False}

        # Derive column names from the first row
        columns = list(limited[0].keys())
        data_rows = [list(r.values()) for r in limited]

        return {
            "columns": columns,
            "rows": data_rows,
            "row_count": len(data_rows),
            "truncated": truncated,
        }

    except (ProgrammingError, OperationalError) as exc:
        logger.error("Query execution failed: %s", exc)
        raise
    except Exception:
        logger.exception("Unexpected error executing query.")
        raise
