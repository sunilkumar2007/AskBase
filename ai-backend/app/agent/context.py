"""AskBase AI Backend - Agent Context Management.

Tracks conversation state, previous queries, results, and schema
snapshots. Keeps context windows efficient by summarizing old turns.
"""
from __future__ import annotations

import logging
import time
import uuid
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger("askbase")


@dataclass
class Message:
    """Single conversation message."""
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: float = field(default_factory=time.time)
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp,
            "metadata": self.metadata,
        }


@dataclass
class QueryTurn:
    """A single agent turn: question → SQL → results → explanation."""
    user_message: str
    sql: str = ""
    data: dict[str, Any] = field(default_factory=dict)
    explanation: str = ""
    chart_type: str = ""
    chart_spec: dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class AgentContext:
    """Full conversation context for a session."""

    conversation_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str = ""
    user_id: str = ""
    database_url: str = ""
    schema: dict[str, Any] = field(default_factory=dict)

    # ── Conversation history ────────────────────────────────────────────────────
    messages: list[Message] = field(default_factory=list)
    turns: list[QueryTurn] = field(default_factory=list)

    # ── Current state ───────────────────────────────────────────────────────────
    selected_table: str = ""
    selected_columns: list[str] = field(default_factory=list)
    date_filter: str = ""  # e.g., "2026" from "Only 2026"
    sort_order: str = ""  # e.g., "DESC" from "top 5 by revenue"

    # ── Config ──────────────────────────────────────────────────────────────────
    max_history_turns: int = 10
    max_messages: int = 20

    # ── Convenience ─────────────────────────────────────────────────────────────
    def add_message(self, role: str, content: str, **metadata) -> None:
        self.messages.append(Message(role=role, content=content, metadata=metadata))
        # Trim old messages
        if len(self.messages) > self.max_messages:
            self.messages = self.messages[-self.max_messages :]

    def add_turn(self, turn: QueryTurn) -> None:
        self.turns.append(turn)
        if len(self.turns) > self.max_history_turns:
            self.turns = self.turns[-self.max_history_turns :]

    @property
    def last_turn(self) -> QueryTurn | None:
        return self.turns[-1] if self.turns else None

    def get_gemini_history(self) -> list[dict[str, str]]:
        """Return a condensed history suitable for Gemini context window."""
        return [{"role": m.role, "content": m.content} for m in self.messages[-10:]]

    def to_dict(self) -> dict[str, Any]:
        return {
            "conversation_id": self.conversation_id,
            "project_id": self.project_id,
            "user_id": self.user_id,
            "messages": [m.to_dict() for m in self.messages],
            "turn_count": len(self.turns),
            "selected_table": self.selected_table,
            "date_filter": self.date_filter,
        }
