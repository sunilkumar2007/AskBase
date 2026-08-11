"""AskBase AI Backend - Database Connection Layer.

Centralized SQLAlchemy async engine and session management.
All database access flows through this module.
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
 AsyncSession,
 async_sessionmaker,
 create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config import settings

logger = logging.getLogger("askbase")

# ── Engine ───────────────────────────────────────────────────────────────────

_engine = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def get_engine():
 global _engine
 if _engine is None:
 raise RuntimeError(
 "Database engine not initialized. "
 "Call init_db() at application startup first."
 )
 return _engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
 global _session_factory
 if _session_factory is None:
 raise RuntimeError(
 "Session factory not initialized. Call init_db() first."
 )
 return _session_factory


def init_db() -> None:
 global _engine, _session_factory
 if _engine is not None:
 logger.debug("Database engine already initialized.")
 return

 if not settings.DATABASE_URL:
 logger.warning("DATABASE_URL not set — database features disabled.")
 return

 connect_args = {"timeout": settings.QUERY_TIMEOUT_SECONDS}
 _engine = create_async_engine(
 settings.DATABASE_URL,
 echo=settings.is_development,
 pool_pre_ping=True,
 pool_size=5,
 max_overflow=10,
 pool_timeout=30,
 pool_recycle=3600,
 connect_args=connect_args,
 )
 _session_factory = async_sessionmaker(
 _engine,
 class_=AsyncSession,
 expire_on_commit=False,
 )
 logger.info("Database engine initialized (env=%s).", settings.ENVIRONMENT)


async def dispose_db() -> None:
 global _engine, _session_factory
 if _engine is not None:
 await _engine.dispose()
 _engine = None
 _session_factory = None
 logger.info("Database engine disposed.")


# ── Session helper ───────────────────────────────────────────────────────────

@asynccontextmanager
async def session_scope() -> AsyncGenerator[AsyncSession, None]:
 """Provide a transactional scope for a series of database operations."""
 factory = get_session_factory()
 async with factory() as session:
 try:
 yield session
 await session.commit()
 except Exception:
 await session.rollback()
 raise
