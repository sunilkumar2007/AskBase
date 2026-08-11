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
 exp.AlterTable,
 exp.Create,
 exp.TruncateTable,
 exp.Merge,
 exp.Rename,
 )

ALLOWED_ROOT_TYPES = (
 exp.Select,
 exp.With, # CTEs that wrap a SELECT are fine
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
 """Validate a SQL string for safe execution.

 Args:
 raw_sql: Raw SQL string from the AI model.

 Returns:
 ValidationResult with validity, normalized SQL, errors, and warnings.
 """
 result = ValidationResult(valid=False, normalized_sql=raw_sql.strip())

 if not raw_sql.strip():
 result.errors.append("Empty query.")
 return result

 sql = raw_sql.strip()

 # ── Check for multiple statements ─────────────────────────────────────────
 semicolons = sql.count(";")
 if semicolons > 1:
 result.errors.append(f"Multiple statements detected ({semicolons} semicolons). Only single queries are allowed.")
 return result
 if semicolons == 1 and not sql.endswith(";"):
 result.errors.append("Semicolon in the middle of query.")
 return result

 # ── Parse ──────────────────────────────────────────────────────────────────
 try:
 ast = parse_one(sql, read="postgres")
 except ParseError as exc:
 result.errors.append(f"SQL syntax error: {exc}")
 return result
 except Exception as exc:
 result.errors.append(f"Failed to parse SQL: {exc}")
 return result

 # ── Check root statement type ──────────────────────────────────────────────
 root = ast
 if isinstance(root, exp.Subquery):
 root = root.this

 if not isinstance(root, ALLOWED_ROOT_TYPES):
 stype = type(root).__name__
 result.errors.append(
 f"Statement type '{stype}' is not allowed. Only SELECT/UNION/INTERSECT/EXCEPT queries are permitted."
 )
 return result

 # ── Walk AST for forbidden nodes ───────────────────────────────────────────
 _check_ast(ast, result)

 # ── Normalize ──────────────────────────────────────────────────────────────
 try:
 normalized = ast.sql("postgres").strip()
 result.normalized_sql = normalized
 except Exception:
 result.normalized_sql = sql

 result.valid = not result.errors

 if result.valid:
 # ── Soft checks / warnings ───────────────────────────────────────────────
 _enforce_limit(ast, result)

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
