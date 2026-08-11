"""AskBase AI Backend — canonical FastAPI application.

This is the single source of truth for the ASGI app.
The root-level ai-backend/main.py is a thin compatibility wrapper.
"""
from __future__ import annotations

import logging
import time
from collections.abc import Callable, Awaitable
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.connection import init_db, dispose_db

logger = logging.getLogger("askbase")


# ── Lifecycle ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
 """Application startup and shutdown logic."""
 await _log_startup()
 init_db()
 yield
 await dispose_db()
 logger.info("AskBase backend shut down complete.")


# ── Factory ─────────────────────────────────────────────────────────────────

def create_app() -> FastAPI:
 app = FastAPI(
 title="AskBase AI Backend",
 description="Natural language data-analytics API",
 version="1.0.0",
 lifespan=lifespan,
 )

 # ── CORS ──────────────────────────────────────────────────────────────────
 app.add_middleware(
 CORSMiddleware,
 allow_origins=settings.cors_origins_list,
 allow_credentials=True,
 allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
 allow_headers=["Authorization", "Content-Type"],
 )

 # ── Middleware: request timing ─────────────────────────────────────────────
 @app.middleware("http")
 async def _timing_middleware(
 request: Request,
 call_next: Callable[[Request], Awaitable[JSONResponse]],
 ):
 start = time.perf_counter()
 try:
 response = await call_next(request)
 response.headers["X-Process-Time"] = f"{time.perf_counter() - start:.3f}"
 return response
 except Exception:
 logger.exception("Unhandled error processing %s %s", request.method, request.url.path)
 return JSONResponse(
 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
 content={"error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred."}},
 )

 # ── Health check ───────────────────────────────────────────────────────────
 @app.get("/health", tags=["system"])
 async def health_check():
 return {"status": "ok"}

 # ── Routers (registered in order; routers must exist before import) ────────
 from app.api.chat import router as chat_router
 from app.api.agent import router as agent_router
 from app.api.projects import router as projects_router
 from app.api.reports import router as reports_router
 from app.api.dashboards import router as dashboards_router
 from app.api.files import router as files_router

 app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
 app.include_router(agent_router, prefix="/api/agent", tags=["agent"])
 app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
 app.include_router(reports_router, prefix="/api/reports", tags=["reports"])
 app.include_router(dashboards_router, prefix="/api/dashboards", tags=["dashboards"])
 app.include_router(files_router, prefix="/api/files", tags=["files"])

 # ── Exception handlers ─────────────────────────────────────────────────────
 from fastapi.exceptions import RequestValidationError

 @app.exception_handler(RequestValidationError)
 async def _validation_error_handler(request: Request, exc: RequestValidationError):
 return JSONResponse(
 status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
 content={"error": {"code": "VALIDATION_ERROR", "message": str(exc.errors())}},
 )

 return app


# ── Helpers ─────────────────────────────────────────────────────────────────

async def _log_startup() -> None:
 logger.info(
 "Starting AskBase AI Backend | env=%s | port=%s | gemini_model=%s",
 settings.ENVIRONMENT,
 settings.PORT,
 settings.GEMINI_MODEL,
 )
