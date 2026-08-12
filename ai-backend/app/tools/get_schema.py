"""AskBase AI Backend - get_schema tool.

Discovers the structure of a project's database and returns a
JSON-serializable schema description for SQL generation.
"""
from __future__ import annotations

import logging
from typing import Any

from app.database.schema import inspect_schema
from app.database.queries import execute_select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger("askbase")


async def get_schema(
    session: AsyncSession,
    database_url: str | None = None,
    table_names: list[str] | None = None,
) -> dict[str, Any]:
    """Return database schema information.

    Args:
        session: Active SQLAlchemy async session (used for AskBase metadata queries).
        database_url: Target project database URL. If None, inspects the session's DB.
        table_names: Optional filter — only return these tables.

    Returns:
        Schema dict: {"tables": [...]}
    """
    if database_url:
        # External project database
        return await inspect_schema(database_url)

    # Default: inspect the AskBase app database via the session
    try:
        result = await session.execute(
            """
            SELECT table_name, column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position
            """
        )
        rows = result.fetchall()

        tables: dict[str, list[dict[str, Any]]] = {}
        for row in rows:
            tname = row[0]
            if table_names and tname not in table_names:
                continue
            tables.setdefault(tname, []).append(
                {
                    "name": row[1],
                    "type": row[2],
                    "nullable": row[3] == "YES",
                    "default": row[4],
                }
            )

        return {"tables": [{"name": tname, "columns": cols} for tname, cols in tables.items()]}

    except Exception:
        logger.exception("Failed to inspect schema from session.")
        return {"tables": []}


async def get_table_names(session: AsyncSession) -> list[str]:
    """Return a flat list of all table names in the current database."""
    try:
        result = await session.execute(
            """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name
            """
        )
        return [r[0] for r in result.fetchall()]
    except Exception:
        logger.exception("Failed to list tables.")
        return []
