import asyncio
import pytest
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.modules.data_output.router import router as data_output_router
from app.modules.data_output.db.base import Base

try:
    import aiosqlite
    HAS_AIOSQLITE = True
except ImportError:
    HAS_AIOSQLITE = False

if HAS_AIOSQLITE:
    from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
    TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_engine():
    if not HAS_AIOSQLITE:
        pytest.skip("aiosqlite not installed in local environment")
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def test_db(test_engine) -> AsyncGenerator:
    if not HAS_AIOSQLITE:
        pytest.skip("aiosqlite not installed in local environment")
    async_session = async_sessionmaker(test_engine, expire_on_commit=False, class_=AsyncSession)
    async with async_session() as session:
        yield session


@pytest.fixture
def client():
    app = FastAPI()
    app.include_router(data_output_router)
    return TestClient(app)
