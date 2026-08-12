import pytest
import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

from app.modules.data_output.services.query_service import QueryService
from app.modules.data_output.db.models.query import Query, QueryResult


def test_sqlglot_valid_select_queries():
    valid_queries = [
        "SELECT * FROM users",
        "SELECT id, name FROM projects WHERE created_at > '2026-01-01'",
        "WITH summary AS (SELECT count(*) as cnt FROM files) SELECT * FROM summary",
        "SELECT p.id, count(m.id) FROM projects p JOIN project_members m ON p.id = m.project_id GROUP BY p.id",
    ]
    for sql in valid_queries:
        is_clean, compiled, tables = QueryService.validate_and_compile_sql(sql)
        assert is_clean is True, f"Expected clean SELECT for query: {sql}"
        assert len(compiled) > 0


def test_sqlglot_rejection_of_write_and_ddl_statements():
    forbidden_queries = [
        "INSERT INTO users (id, email) VALUES ('123', 'test@test.com')",
        "UPDATE projects SET name = 'Hacked' WHERE id = '123'",
        "DELETE FROM files WHERE id = '123'",
        "DROP TABLE projects",
        "ALTER TABLE users ADD COLUMN secret text",
        "TRUNCATE TABLE chats",
        "GRANT ALL PRIVILEGES ON DATABASE postgres TO public",
        "SELECT * FROM users; DROP TABLE users;",  # Multi-statement injection
    ]
    for sql in forbidden_queries:
        is_clean, compiled, tables = QueryService.validate_and_compile_sql(sql)
        assert is_clean is False, f"Expected rejection for non-read-only query: {sql}"


@pytest.mark.asyncio
async def test_bounded_fetchmany_truncation():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        # Create only query and query_result tables for SQLite test
        await conn.run_sync(lambda sync_conn: Query.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: QueryResult.__table__.create(sync_conn, checkfirst=True))
        await conn.execute(text("CREATE TABLE test_items (id INT);"))
        for i in range(10):
            await conn.execute(text(f"INSERT INTO test_items (id) VALUES ({i});"))

    async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_factory() as session:
        query_rec = Query(
            id=uuid.uuid4(),
            project_id=uuid.uuid4(),
            raw_sql="SELECT * FROM test_items ORDER BY id",
            compiled_sql="SELECT * FROM test_items ORDER BY id",
            dialect="postgres",
            is_read_only=True,
            created_by=uuid.uuid4(),
        )
        session.add(query_rec)
        await session.flush()

        # Test 1: max_rows = 5 -> expect 5 rows and is_truncated = True
        res_rec, cols, rows, is_truncated = await QueryService.execute_read_only_query(
            db=session,
            query=query_rec,
            max_rows=5,
        )
        assert len(rows) == 5
        assert is_truncated is True
        assert res_rec.status == "completed"

        # Test 2: max_rows = 20 -> expect 10 rows and is_truncated = False
        res_rec2, cols2, rows2, is_truncated2 = await QueryService.execute_read_only_query(
            db=session,
            query=query_rec,
            max_rows=20,
        )
        assert len(rows2) == 10
        assert is_truncated2 is False
        assert res_rec2.status == "completed"

    await engine.dispose()


@pytest.mark.asyncio
async def test_non_read_only_query_rejection():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(lambda sync_conn: Query.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: QueryResult.__table__.create(sync_conn, checkfirst=True))

    async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_factory() as session:
        query_rec = Query(
            id=uuid.uuid4(),
            project_id=uuid.uuid4(),
            raw_sql="DELETE FROM test_items",
            compiled_sql="DELETE FROM test_items",
            dialect="postgres",
            is_read_only=False,
            created_by=uuid.uuid4(),
        )
        session.add(query_rec)
        await session.flush()

        res_rec, cols, rows, is_truncated = await QueryService.execute_read_only_query(
            db=session,
            query=query_rec,
        )
        assert res_rec.status == "rejected"
        assert "rejected" in res_rec.error_message
        assert len(rows) == 0

    await engine.dispose()
