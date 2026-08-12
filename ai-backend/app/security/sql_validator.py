"""AskBase AI Backend - SQL Validator.

Uses SQLGlot AST parsing to enforce read-only analytics queries.

Rejected patterns (non-exhaustive):
  - Non-SELECT statements (INSERT / UPDATE / DELETE / DROP / ALTER / CREATE / TRUNCATE)
  - Multiple statements
  - Subqueries in FROM without SELECT wrapping
  - Writes disguised as CTEs

Never relies on regex alone — all checks use the AST.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

import sqlglot
from sqlglot import exp, parse_one
from sqlglot.errors import ParseError

logger = logging.getLogger("askbase")

# ── DDL / DML statement types that are NEVER allowed ─────────────────────────
_FORBIDDEN_STMT_TYPES = (
    exp.Insert,
    exp.Update,
    exp.Delete,
    exp.Drop,
    exp.Alter,
    exp.Create,
    exp.TruncateTable,
    exp.Merge,
)



ALLOWED_ROOT_TYPES = (
    exp.Select,
    exp.With,  # CTEs that wrap a SELECT are fine
    exp.Union,
    exp.Intersect,
    exp.Except,
)


@dataclass
class ValidationResult:
    """Structured SQL validation result."""
    valid: bool
    normalized_sql: str = ""
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "valid": self.valid,
            "normalized_sql": self.normalized_sql,
            "errors": self.errors,
            "warnings": self.warnings,
        }


def validate_sql(raw_sql: str) -> ValidationResult:
    """Validate a SQL string for safe execution using Module 3 safety boundary.

    Args:
        raw_sql: Raw SQL string from the AI model.

    Returns:
        ValidationResult with validity, normalized SQL, errors, and warnings.
    """
    result = ValidationResult(valid=False, normalized_sql=raw_sql.strip())

    if not raw_sql.strip():
        result.errors.append("Empty query.")
        return result

    try:
        from app.modules.data_output.integration.module2_contracts import (
            validate_agent_sql,
            AgentQueryExecutionPayload,
        )

        payload = AgentQueryExecutionPayload(project_id="default", generated_sql=raw_sql)
        contract_res = validate_agent_sql(payload)

        result.valid = contract_res.is_safe
        result.normalized_sql = contract_res.compiled_sql
        if not contract_res.is_safe and contract_res.rejection_reason:
            result.errors.append(contract_res.rejection_reason)
    except Exception as exc:
        result.errors.append(f"SQL validation error: {exc}")

    return result


def _check_ast(node: exp.Expression, result: ValidationResult) -> None:
    """Recursively walk AST looking for forbidden constructs."""
    for child in node.iter_expressions():
        # Check for forbidden statement types
        if isinstance(child, _FORBIDDEN_STMT_TYPES):
            stype = type(child).__name__
            result.errors.append(f"Forbidden SQL construct: {stype}.")

        # Check for dangerous function calls
        if isinstance(child, (exp.Unknown, exp.Func)):
            fname = (child.sql_name() or "").lower() if hasattr(child, "sql_name") else ""
            if fname in {"pg_sleep", "pg_terminate_backend", "pg_cancel_backend"}:
                result.errors.append(f"Dangerous function call: {fname}().")

        # Check for COPY (file I/O)
        if isinstance(child, exp.Command):
            cmd = child.name.upper() if child.name else ""
            if cmd.startswith("COPY"):
                result.errors.append("COPY command is forbidden.")

        # Recurse
        _check_ast(child, result)


def _enforce_limit(ast: exp.Expression, result: ValidationResult) -> None:
    """Warn if the query has no LIMIT and could return unbounded rows."""
    has_limit = ast.find(exp.Limit) is not None
    if not has_limit:
        result.warnings.append("Query has no LIMIT clause — results may be large.")


def is_read_only_select(sql: str) -> bool:
    """Convenience predicate — returns True if SQL is a safe read-only query."""
    return validate_sql(sql).valid
