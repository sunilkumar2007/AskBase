"""
ASKBASE Module 3 - Data & Output
Isolated module for database persistence, storage, analytics, exporters, and REST APIs.
"""

from app.modules.data_output.router import router as data_output_router

__all__ = ["data_output_router"]
