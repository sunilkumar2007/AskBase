"""AskBase AI Backend - Schema Inspector.

Inspects customer / project databases and returns structured schema information
used by the SQL generation skill.
"""
from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import inspect, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import create_async_engine

from app.config import settings

logger = logging.getLogger("askbase")


async def inspect_schema(database_url: str) -> dict[str, Any]:
 """Inspect a target database and return a JSON-serializable schema description.

 Args:
 database_url: SQLAlchemy-compatible async URL (e.g. postgresql+asyncpg://...)

 Returns:
 {
 "tables": [
 {
 "name": "orders",
 "columns": [{"name": "id", "type": "INTEGER", "nullable": false}, ...],
 "primary_keys": ["id"],
 "foreign_keys": [
 {"column": "customer_id", "references_table": "customers", "references_column": "id"}
 ]
 }
 ]
 }
 """
 engine = create_async_engine(database_url, poolclass=NullPool, pool_pre_ping=True)
 try:
 async with engine.connect() as conn:
 raw = inspect(conn)
 tables: list[dict[str, Any]] = []

 # ── Tables ─────────────────────────────────────────────────────────────────
 table_names = raw.get_table_names()
 for tname in table_names:
 try:
 columns_raw = raw.get_columns(tname)
 pk = raw.get_pk_constraint(tname)
 fks = raw.get_foreign_keys(tname)

 columns = [
 {
 "name": c["name"],
 "type": str(c["type"]),
 "nullable": c.get("nullable", True),
 "default": str(c.get("default", "")) if c.get("default") else None,
 }
 for c in columns_raw
 ]

 tables.append(
 {
 "name": tname,
 "columns": columns,
 "primary_keys": pk.get("constrained_columns", []) if pk else [],
 "foreign_keys": [
 {
 "column": fk["constrained_columns"][0],
 "references_table": fk["referred_table"],
 "references_column": fk["referred_columns"][0],
 }
 for fk in fks
 if fk.get("constrained_columns") and fk.get("referred_columns")
 ],
 }
 )
 except Exception as exc:
 logger.warning("Failed to inspect table %s: %s", tname, exc)
 continue

 return {"tables": tables}

 finally:
 await engine.dispose()


async def inspect_supabase_tables() -> list[str] | None:
 """Return list of tables in the AskBase Supabase metadata database."""
 if not settings.DATABASE_URL:
 return None
 engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
 try:
 async with engine.connect() as conn:
 raw = inspect(conn)
 return raw.get_table_names()
 except OperationalError:
 logger.exception("Cannot reach Supabase metadata database.")
 return None
 finally:
 await engine.dispose()
