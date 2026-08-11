from fastapi import APIRouter, HTTPException
from app.agent.context import ContextManager
from app.agent import Agent
from app.security.sql_validator import validate_sql

router = APIRouter()
context_manager = ContextManager()
agent = Agent(context_manager)

@router.post("/process")
async def process_request(request: dict):
 pass

@router.get("/status/{session_id}")
async def get_status(session_id: str):
 pass
