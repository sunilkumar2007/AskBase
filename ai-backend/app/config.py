"""Re-export of configuration so ``from app.config import settings`` works everywhere."""
from app.config import settings # noqa: F401

__all__ = ["settings"]
