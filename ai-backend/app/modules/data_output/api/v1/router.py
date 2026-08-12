from fastapi import APIRouter

from app.modules.data_output.api.v1.projects import router as projects_router
from app.modules.data_output.api.v1.data_sources import router as data_sources_router
from app.modules.data_output.api.v1.files import router as files_router
from app.modules.data_output.api.v1.chats import router as chats_router
from app.modules.data_output.api.v1.queries import router as queries_router
from app.modules.data_output.api.v1.dashboards import router as dashboards_router
from app.modules.data_output.api.v1.reports import router as reports_router
from app.modules.data_output.api.v1.exports import router as exports_router
from app.modules.data_output.api.v1.lineage import router as lineage_router
from app.modules.data_output.api.v1.analytics import router as analytics_router

v1_router = APIRouter()

v1_router.include_router(projects_router)
v1_router.include_router(data_sources_router)
v1_router.include_router(files_router)
v1_router.include_router(chats_router)
v1_router.include_router(queries_router)
v1_router.include_router(dashboards_router)
v1_router.include_router(reports_router)
v1_router.include_router(exports_router)
v1_router.include_router(lineage_router)
v1_router.include_router(analytics_router)
