"""AskBase AI Backend - execute_query tool.

Executes validated SELECT queries safely against a project's database.
The SQL MUST pass through security.sql_validator before this tool is called.
"""
from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import text
from sqlalchemy.exc import OperationalError, ProgrammingError, TimeoutError as SQLATimeout
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from app.database.queries import execute_select
from app.security.sql_validator import validate_sql
from app.config import settings

logger = logging.getLogger("askbase")


async def execute_query(
    session: AsyncSession | None = None,
    database_url: str | None = None,
    sql: str = "",
    params: dict[str, Any] | None = None,
    max_rows: int | None = None,
) -> dict[str, Any]:
    """Execute a safe read-only SQL query and return structured data.

    Args:
        session: Active SQLAlchemy async session (AskBase app DB).
        database_url: Project database URL. If provided, creates a one-off engine.
        sql: The SQL query to execute. MUST be pre-validated.
        params: Optional bound parameters.
        max_rows: Override default row limit.

    Returns:
        Structured data dict: {"columns": [...], "rows": [...], "row_count": int, "truncated": bool}

    Raises:
        ValueError: If SQL fails validation.
        RuntimeError: If neither session nor database_url is provided.
    """
    if not sql.strip():
        raise ValueError("Empty SQL query.")

    # ── Validate ───────────────────────────────────────────────────────────────
    validation = validate_sql(sql)
    if not validation.valid:
        raise ValueError(f"SQL validation failed: {'; '.join(validation.errors)}")

    sql = validation.normalized_sql
    max_rows = max_rows or settings.QUERY_MAX_ROWS

    # ── Execute ────────────────────────────────────────────────────────────────
    if database_url:
        # One-off connection to the project database
        engine = create_async_engine(database_url, poolclass=NullPool, pool_pre_ping=True)
        try:
            async with engine.connect() as conn:
                # Apply statement timeout at the DB level where supported
                result = await conn.execute(text(sql), params or {})
                return _format_result(result, max_rows)
        except (OperationalError, ProgrammingError, SQLATimeout) as exc:
            logger.error("Query execution failed against project DB: %s", exc)
            raise
        finally:
            await engine.dispose()

    if session is None:
        raise RuntimeError("Either session or database_url must be provided.")

    try:
        return await execute_select(session, sql, params, max_rows)
    except (OperationalError, ProgrammingError, SQLATimeout) as exc:
        logger.error("Query execution failed: %s", exc)
        raise


def _format_result(result, max_rows: int) -> dict[str, Any]:
    """Convert a SQLAlchemy result into the standard data format."""
    rows = result.mappings().fetchall()
    truncated = len(rows) >= max_rows
    limited = rows[:max_rows] if truncated else rows

    if not limited:
        return {"columns": [], "rows": [], "row_count": 0, "truncated": False}

    columns = list(limited[0].keys())
    data_rows = [list(r.values()) for r in limited]
    return {
        "columns": columns,
        "rows": data_rows,
        "row_count": len(data_rows),
        "truncated": truncated,
    }
