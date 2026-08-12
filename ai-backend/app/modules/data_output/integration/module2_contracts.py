"""
Module 2 (AI/Agent Backend) Integration Contract Specifications.

Module 2 generates or modifies SQL. Before execution, Module 2 passes SQL through
Module 3's SQLGlot safety boundary to enforce read-only semantics and extract lineage.
"""

from typing import Tuple, List, Optional
from pydantic import BaseModel, Field
from app.modules.data_output.services.query_service import QueryService


class AgentQueryExecutionPayload(BaseModel):
    """Payload contract received from Module 2 AI Agent."""

    project_id: str
    chat_id: Optional[str] = None
    generated_sql: str
    dialect: str = "postgres"
    agent_metadata: dict = Field(default_factory=dict)


class AgentQueryValidationResult(BaseModel):
    """Result returned to Module 2 indicating SQL safety status."""

    is_safe: bool
    is_read_only: bool
    compiled_sql: str
    referenced_tables: List[str]
    rejection_reason: Optional[str] = None


def validate_agent_sql(payload: AgentQueryExecutionPayload) -> AgentQueryValidationResult:
    """Synchronous validation interface for Module 2 AI Agent."""
    is_read_only, compiled_sql, tables = QueryService.validate_and_compile_sql(
        raw_sql=payload.generated_sql, dialect=payload.dialect
    )

    if not is_read_only:
        return AgentQueryValidationResult(
            is_safe=False,
            is_read_only=False,
            compiled_sql=compiled_sql,
            referenced_tables=tables,
            rejection_reason="Query contains non-read-only statement (INSERT, UPDATE, DELETE, DROP, etc.)",
        )

    return AgentQueryValidationResult(
        is_safe=True,
        is_read_only=True,
        compiled_sql=compiled_sql,
        referenced_tables=tables,
    )
