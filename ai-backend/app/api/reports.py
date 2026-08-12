from fastapi import APIRouter
from app.services.report_service import ReportService

router = APIRouter()
report_service = ReportService()

@router.post("/generate/{project_id}")
async def generate_report(project_id: str, config: dict):
 pass

@router.get("/{report_id}")
async def get_report(report_id: str):
 pass

@router.get("/list/{project_id}")
async def list_reports(project_id: str):
 pass
