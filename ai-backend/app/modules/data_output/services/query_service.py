import time
import uuid
from typing import Tuple, List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.modules.data_output.db.models.query import Query, QueryResult, SavedQuery
from app.modules.data_output.db.models.lineage import DataLineage
from app.modules.data_output.config import settings

try:
    import sqlglot
    from sqlglot import exp
except ImportError:
    sqlglot = None

# Defaults
MAX_QUERY_RESULT_ROWS = 50000
QUERY_STATEMENT_TIMEOUT_MS = 30000


class QueryService:
    """Service handling SQLGlot AST validation, connection-scoped timeout, bounded execution, and query persistence."""

    @staticmethod
    def validate_and_compile_sql(
        raw_sql: str, dialect: str = "postgres"
    ) -> Tuple[bool, str, List[str]]:
        """
        Validate SQL using SQLGlot AST parsing.
        Strictly permits SELECT / CTE statements only.
        Blocks DDL (CREATE, DROP, ALTER, TRUNCATE), DML (INSERT, UPDATE, DELETE, MERGE),
        and administrative commands (GRANT, REVOKE, VACUUM, EXECUTE).
        Returns: (is_read_only, compiled_sql, referenced_tables)
        """
        if not raw_sql or not raw_sql.strip():
            return (False, raw_sql, [])

        if sqlglot is None:
            # Fallback regex & string inspection if sqlglot is absent
            upper_sql = raw_sql.strip().upper()
            forbidden = [
                "DROP ", "DELETE ", "INSERT ", "UPDATE ", "ALTER ", "TRUNCATE ",
                "CREATE ", "GRANT ", "REVOKE ", "VACUUM ", "EXECUTE ", "MERGE "
            ]
            is_clean = not any(kw in upper_sql for kw in forbidden)
            if not upper_sql.startswith("SELECT") and not upper_sql.startswith("WITH"):
                is_clean = False
            
            import re
            tables = re.findall(r'(?:FROM|JOIN)\s+([a-zA-Z0-9_\.]+)', raw_sql, re.IGNORECASE)
            clean_tables = [t.split('.')[-1] for t in tables]
            return (is_clean, raw_sql, clean_tables)

        try:
            parsed_expressions = sqlglot.parse(raw_sql, read=dialect)
            if not parsed_expressions or any(e is None for e in parsed_expressions):
                return (False, raw_sql, [])

            # Reject multi-statement queries to prevent injection smuggling
            if len(parsed_expressions) > 1:
                return (False, raw_sql, [])

            expression = parsed_expressions[0]
            is_read_only = True

            # Root AST expression MUST be a Select or Subquery/CTE expression
            if not isinstance(expression, (exp.Select, exp.Union, exp.Subquery, exp.With)):
                is_read_only = False

            # Forbidden AST Nodes
            forbidden_nodes = (
                exp.Insert,
                exp.Update,
                exp.Delete,
                exp.Drop,
                exp.Alter,
                exp.Create,
                exp.TruncateTable,
                exp.Merge,
                exp.Command,
            )



            # Traversal check: no write or DDL node anywhere in the AST
            for node in expression.walk():
                if isinstance(node, forbidden_nodes):
                    is_read_only = False
                    break
                # Extra safety check for commands/functions that mutate
                if isinstance(node, exp.Func) and node.name.upper() in ("PG_SLEEP", "SET_CONFIG"):
                    is_read_only = False
                    break

            tables = set()
            for table in expression.find_all(exp.Table):
                tables.add(table.name)

            compiled_sql = sqlglot.transpile(raw_sql, read=dialect, write=dialect)[0]
            return (is_read_only, compiled_sql, list(tables))
        except Exception:
            return (False, raw_sql, [])

    @staticmethod
    async def create_query_record(
        db: AsyncSession,
        project_id: uuid.UUID,
        user_id: uuid.UUID,
        raw_sql: str,
        chat_id: Optional[uuid.UUID] = None,
        dialect: str = "postgres",
    ) -> Tuple[Query, bool, List[str]]:
        """Create query record with SQLGlot validation."""
        is_read_only, compiled_sql, tables = QueryService.validate_and_compile_sql(
            raw_sql, dialect
        )

        query = Query(
            project_id=project_id,
            chat_id=chat_id,
            raw_sql=raw_sql,
            compiled_sql=compiled_sql,
            dialect=dialect,
            is_read_only=is_read_only,
            created_by=user_id,
        )
        db.add(query)
        await db.flush()

        # Register data lineage for referenced tables
        for tbl in tables:
            lineage = DataLineage(
                project_id=project_id,
                source_type="data_source",
                source_id=uuid.uuid5(uuid.NAMESPACE_DNS, tbl),
                target_type="query",
                target_id=query.id,
                edge_type="derived_from",
                metadata_json={"table_name": tbl},
            )
            db.add(lineage)

        return (query, is_read_only, tables)

    @staticmethod
    async def execute_read_only_query(
        db: AsyncSession,
        query: Query,
        parameters: Optional[Dict[str, Any]] = None,
        max_rows: int = MAX_QUERY_RESULT_ROWS,
        timeout_ms: int = QUERY_STATEMENT_TIMEOUT_MS,
    ) -> Tuple[QueryResult, List[str], List[List[Any]], bool]:
        """
        Execute read-only SELECT query safely:
        1. Verifies is_read_only is True.
        2. Applies connection-scoped 'SET LOCAL statement_timeout' on the exact transaction connection.
        3. Uses fetchmany(max_rows + 1) to bound memory usage and determine truncation cleanly.
        4. Logs query result metadata.
        Returns: (QueryResult, columns, rows, is_truncated)
        """
        if not query.is_read_only:
            result_record = await QueryService.record_query_result(
                db, query.id, [], 0, 0.0, status="rejected", error_message="Non-read-only query rejected by security policy"
            )
            return (result_record, [], [], False)

        start_time = time.perf_counter()
        params = parameters or {}

        try:
            # 1. Connection-scoped statement timeout on exact connection executing SELECT
            # Check if current dialect is PostgreSQL (SQLite ignores SET LOCAL statement_timeout)
            bind = db.bind
            dialect_name = bind.dialect.name if bind else "postgresql"
            
            if "postgres" in dialect_name.lower():
                await db.execute(text(f"SET LOCAL statement_timeout = {timeout_ms}"))

            # 2. Execute target SELECT statement
            cursor = await db.execute(text(query.compiled_sql), params)
            columns = list(cursor.keys()) if cursor.returns_rows else []

            # 3. Bounded memory fetch: fetch at most max_rows + 1 rows
            fetched = cursor.fetchmany(max_rows + 1) if cursor.returns_rows else []
            # Support both async and sync cursors
            if hasattr(fetched, "__await__"):
                fetched = await fetched

            is_truncated = len(fetched) == max_rows + 1
            returned_rows = [list(r) for r in fetched[:max_rows]]

            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

            result_record = await QueryService.record_query_result(
                db=db,
                query_id=query.id,
                columns=columns,
                row_count=len(returned_rows),
                execution_time_ms=elapsed_ms,
                status="completed",
            )
            return (result_record, columns, returned_rows, is_truncated)

        except Exception as e:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            result_record = await QueryService.record_query_result(
                db=db,
                query_id=query.id,
                columns=[],
                row_count=0,
                execution_time_ms=elapsed_ms,
                status="failed",
                error_message=str(e),
            )
            raise RuntimeError(f"Query execution failed: {str(e)}") from e

    @staticmethod
    async def record_query_result(
        db: AsyncSession,
        query_id: uuid.UUID,
        columns: List[str],
        row_count: int,
        execution_time_ms: float,
        status: str = "completed",
        error_message: Optional[str] = None,
    ) -> QueryResult:
        """Record query execution output summary."""
        result = QueryResult(
            query_id=query_id,
            status=status,
            row_count=row_count,
            execution_time_ms=execution_time_ms,
            columns_schema={"columns": columns},
            error_message=error_message,
        )
        db.add(result)
        await db.flush()
        return result
