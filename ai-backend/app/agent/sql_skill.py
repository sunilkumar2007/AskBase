"""AskBase AI Backend - SQL Generation Skill.

Takes a user question + schema, generates safe read-only SQL via Gemini.
The generated SQL is validated by sql_validator before execution.
"""
from __future__ import annotations

import logging
from typing import Any

from app.agent.base_skill import BaseSkill
from app.agent.context import AgentContext
from app.agent.prompts import SQL_GENERATION_PROMPT
from app.services.gemini import get_gemini_service
from app.security.sql_validator import validate_sql

logger = logging.getLogger("askbase")


class SQLSkill(BaseSkill):
    name = "sql_generation"
    description = "Generate safe read-only SQL from a natural language question."
    required_params = ["question"]
    optional_params = ["schema", "conversation_context"]

    async def execute(self, context: AgentContext, params: dict[str, Any]) -> dict[str, Any]:
        self.validate_params(params)

        question = params["question"]
        schema = params.get("schema", context.schema)
        conversation_context = params.get("conversation_context", self._build_context(context))

        if not schema.get("tables"):
            return {
                "sql": "",
                "explanation": "No database schema available. Please connect a database first.",
                "assumptions": [],
                "error": "NO_SCHEMA",
            }

        schema_text = self._format_schema(schema)

        prompt = SQL_GENERATION_PROMPT.format(
            question=question,
            schema=schema_text,
            conversation_context=conversation_context,
        )

        service = get_gemini_service()
        if not service.enabled:
            logger.warning("Gemini disabled — cannot generate SQL.")
            return {
                "sql": "",
                "explanation": "AI service is not configured.",
                "assumptions": [],
                "error": "AI_DISABLED",
            }

        try:
            response = await service.generate_structured(
                prompt=prompt,
                response_schema={
                    "type": "object",
                    "properties": {
                        "sql": {"type": "string"},
                        "explanation": {"type": "string"},
                        "assumptions": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["sql", "explanation"],
                },
            )

            sql = response.get("sql", "").strip()

            # Validate the generated SQL
            validation = validate_sql(sql)
            if not validation.valid:
                logger.warning("Generated SQL failed validation: %s", validation.errors)
                return {
                    "sql": "",
                    "explanation": f"Generated SQL is unsafe: {'; '.join(validation.errors)}",
                    "assumptions": response.get("assumptions", []),
                    "error": "UNSAFE_SQL",
                    "raw_sql": sql,
                }

            return {
                "sql": validation.normalized_sql,
                "explanation": response.get("explanation", ""),
                "assumptions": response.get("assumptions", []),
            }

        except Exception:
            logger.exception("SQL generation failed.")
            return {
                "sql": "",
                "explanation": "Failed to generate SQL. Please try rephrasing your question.",
                "assumptions": [],
                "error": "GENERATION_FAILED",
            }

    def _format_schema(self, schema: dict[str, Any]) -> str:
        """Convert schema dict to a readable text description for the prompt."""
        lines = []
        for table in schema.get("tables", []):
            lines.append(f"Table: {table['name']}")
            for col in table.get("columns", []):
                pk = " (PK)" if col["name"] in table.get("primary_keys", []) else ""
                fk = ""
                for fk_info in table.get("foreign_keys", []):
                    if fk_info["column"] == col["name"]:
                        fk = f" → {fk_info['references_table']}.{fk_info['references_column']}"
                nullable = "NULL" if col.get("nullable") else "NOT NULL"
                lines.append(f" - {col['name']}: {col['type']} {nullable}{pk}{fk}")
            lines.append("")
        return "\n".join(lines)

    def _build_context(self, context: AgentContext, max_turns: int = 3) -> str:
        """Build a conversation context summary for the SQL prompt."""
        if not context.turns:
            return "No previous questions."

        lines = ["Previous questions and results:"]
        for turn in context.turns[-max_turns:]:
            lines.append(f"- Q: {turn.user_message}")
            if turn.sql:
                lines.append(f" SQL: {turn.sql[:100]}...")
            lines.append(f" Result: {turn.data.get('row_count', 0)} rows")

        return "\n".join(lines)
