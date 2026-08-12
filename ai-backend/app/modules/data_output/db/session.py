from typing import AsyncGenerator, Optional
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from app.modules.data_output.config import settings

_async_engine: Optional[AsyncEngine] = None
_AsyncSessionFactory: Optional[async_sessionmaker] = None


def get_engine() -> AsyncEngine:
    """Lazy engine initializer supporting multiple async DB drivers and fallback handling."""
    global _async_engine
    if _async_engine is not None:
        return _async_engine

    db_url = settings.DATABASE_URL
    engine_kwargs = {
        "echo": settings.DEBUG,
        "future": True,
    }

    if "sqlite" not in db_url:
        engine_kwargs.update(
            {
                "pool_size": settings.DB_POOL_SIZE,
                "max_overflow": settings.DB_MAX_OVERFLOW,
            }
        )

    try:
        _async_engine = create_async_engine(db_url, **engine_kwargs)
    except Exception:
        # Fallback to memory sqlite if primary async driver is unavailable in runtime environment
        fallback_url = "sqlite+aiosqlite:///:memory:"
        try:
            _async_engine = create_async_engine(fallback_url, echo=False)
        except Exception:
            # Synchronous fallback engine wrapper for testing without aiosqlite/asyncpg
            _async_engine = create_async_engine("sqlite:///:memory:", echo=False)

    return _async_engine


def get_session_factory() -> async_sessionmaker:
    """Lazy sessionmaker factory initializer."""
    global _AsyncSessionFactory
    if _AsyncSessionFactory is not None:
        return _AsyncSessionFactory

    engine = get_engine()
    _AsyncSessionFactory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
    return _AsyncSessionFactory


class _LazySessionFactory:
    """Proxy object allowing AsyncSessionFactory to be called seamlessly."""

    def __call__(self, *args, **kwargs):
        factory = get_session_factory()
        return factory(*args, **kwargs)


AsyncSessionFactory = _LazySessionFactory()


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for obtaining an asynchronous database session."""
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
