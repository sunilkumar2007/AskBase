"""AskBase AI Backend - API Routes."""
from fastapi import APIRouter

from app.api.routes.projects import router as projects_router
from app.api.routes.chat import router as chat_router
from app.api.routes.agent import router as agent_router
from app.api.routes.reports import router as reports_router
from app.api.routes.dashboards import router as dashboards_router
from app.api.routes.files import router as files_router
from app.api.voice import router as voice_router

router = APIRouter()

router.include_router(projects_router, prefix="/projects", tags=["projects"])
router.include_router(chat_router, prefix="/chat", tags=["chat"])
router.include_router(agent_router, prefix="/agent", tags=["agent"])
router.include_router(reports_router, prefix="/reports", tags=["reports"])
router.include_router(dashboards_router, prefix="/dashboards", tags=["dashboards"])
router.include_router(files_router, prefix="/files", tags=["files"])
router.include_router(voice_router)

