"""ai-backend/main.py

Thin compatibility entry point.

The canonical FastAPI application lives in ai-backend/app/main.py.
This file simply re-exports it so that existing tooling expecting
the old entry point continues to work.
"""
from app.main import app # noqa: F401

__all__ = ["app"]
