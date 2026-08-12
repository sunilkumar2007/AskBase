from fastapi import APIRouter
from app.database.connection import get_pool
from datetime import datetime

router = APIRouter()

@router.get("/")
async def list_projects():
 pass

@router.post("/")
async def create_project(project: dict):
 pass

@router.get("/{project_id}")
async def get_project(project_id: str):
 pass

@router.put("/{project_id}")
async def update_project(project_id: str, project: dict):
 pass

@router.delete("/{project_id}")
async def delete_project(project_id: str):
 pass
