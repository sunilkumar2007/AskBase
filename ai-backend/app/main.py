"""AskBase AI Backend - Application entry point.

Initializes the FastAPI app, middleware, and route handlers.
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.connection import init_db, dispose_db
from app.api.routes import router as api_router

logger = logging.getLogger("askbase")


@asynccontextmanager
async def lifespan(app: FastAPI):
 """Application lifespan — startup and shutdown hooks."""
 logger.info("Starting AskBase AI Backend (env=%s)...", settings.ENVIRONMENT)
 init_db()
 yield
 logger.info("Shutting down AskBase AI Backend...")
 await dispose_db()


def create_app() -> FastAPI:
 app = FastAPI(
 title="AskBase AI Backend",
 description="Natural-language data analysis for non-technical users.",
 version="0.1.0",
 lifespan=lifespan,
 )

 # ── CORS ───────────────────────────────────────────────────────────────────
 app.add_middleware(
 CORSMiddleware,
 allow_origins=[settings.CORS_ORIGINS],
 allow_credentials=True,
 allow_methods=["*"],
 allow_headers=["*"],
 )

 # ── Routes ──────────────────────────────────────────────────────────────────
 app.include_router(api_router, prefix="/api")

 @app.get("/health")
 async def health():
 return {"status": "ok", "environment": settings.ENVIRONMENT}

 return app
