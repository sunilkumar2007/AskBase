import pytest
from app.modules.data_output.services.query_service import QueryService
from app.modules.data_output.integration.module2_contracts import (
    AgentQueryExecutionPayload,
    validate_agent_sql,
)


def test_sqlglot_select_validation():
    sql = "SELECT id, name, created_at FROM public.users WHERE status = 'active'"
    is_read_only, compiled_sql, tables = QueryService.validate_and_compile_sql(sql)
    assert is_read_only is True
    assert "users" in tables or "public.users" in tables


def test_sqlglot_drop_rejection():
    sql = "DROP TABLE public.users"
    is_read_only, compiled_sql, tables = QueryService.validate_and_compile_sql(sql)
    assert is_read_only is False


def test_sqlglot_delete_rejection():
    sql = "DELETE FROM public.orders WHERE id = 1"
    is_read_only, compiled_sql, tables = QueryService.validate_and_compile_sql(sql)
    assert is_read_only is False


def test_module2_contract_validation():
    payload = AgentQueryExecutionPayload(
        project_id="00000000-0000-0000-0000-000000000001",
        generated_sql="SELECT COUNT(*) FROM sales_data",
    )
    res = validate_agent_sql(payload)
    assert res.is_safe is True
    assert res.is_read_only is True
