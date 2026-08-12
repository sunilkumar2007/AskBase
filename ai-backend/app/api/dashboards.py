from fastapi import APIRouter
from app.dashboard_service import DashboardService

router = APIRouter()
dashboard_service = DashboardService()

@router.post("/")
async def create_dashboard(config: dict):
 pass

@router.get("/{dashboard_id}")
async def get_dashboard(dashboard_id: str):
 pass

@router.put("/{dashboard_id}")
async def update_dashboard(dashboard_id: str, config: dict):
 pass

@router.delete("/{dashboard_id}")
async def delete_dashboard(dashboard_id: str):
 pass
