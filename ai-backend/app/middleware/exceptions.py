"""AskBase AI Backend - Global Exception Handlers.

Converts unhandled exceptions into consistent JSON error responses.
"""
from __future__ import annotations

import logging
import traceback

from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, ProgrammingError

from app.config import settings

logger = logging.getLogger("askbase")


async def global_exception_handler(request: Request, exc: Exception):
 """Catch-all handler — returns structured JSON errors."""
 if isinstance(exc, OperationalError):
 logger.error("Database operational error: %s", exc)
 return JSONResponse(
 status_code=503,
 content={
 "error": "DATABASE_UNAVAILABLE",
 "message": "The database is temporarily unavailable. Please try again.",
 "detail": str(exc) if settings.is_development else None,
 },
 )

 if isinstance(exc, ProgrammingError):
 logger.error("Database programming error: %s", exc)
 return JSONResponse(
 status_code=500,
 content={
 "error": "DATABASE_ERROR",
 "message": "A database query failed.",
 "detail": str(exc) if settings.is_development else None,
 },
 )

 logger.exception("Unhandled exception on %s %s", request.method, request.url.path)

 return JSONResponse(
 status_code=500,
 content={
 "error": "INTERNAL_ERROR",
 "message": "An unexpected error occurred.",
 "detail": traceback.format_exc() if settings.is_development else None,
 },
 )
