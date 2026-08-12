"""AskBase AI Backend - Base Skill class.

All skills inherit from this. Skills receive structured parameters
and return structured results. They never mutate global state directly.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, TYPE_CHECKING

if TYPE_CHECKING:
    from app.agent.context import AgentContext


class BaseSkill(ABC):
    """Abstract base class for all agent skills."""

    # Each skill declares what parameters it accepts and produces
    name: str = ""
    description: str = ""
    required_params: list[str] = []
    optional_params: list[str] = []

    @abstractmethod
    async def execute(self, context: "AgentContext", params: dict[str, Any]) -> dict[str, Any]:
        """Run the skill with the given context and parameters.

        Args:
            context: Full conversation + project context.
            params: Skill-specific parameters (from the planner or previous skill).

        Returns:
            Structured result dict. Keys depend on the skill.
        """
        ...

    def validate_params(self, params: dict[str, Any]) -> None:
        """Raise ValueError if required params are missing."""
        missing = [p for p in self.required_params if p not in params]
        if missing:
            raise ValueError(f"{self.name} skill missing required params: {', '.join(missing)}")
