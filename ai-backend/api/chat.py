from fastapi import APIRouter, WebSocket, HTTPException
from app.agent.context import ContextManager
from app.agent import Agent
from app.security.sql_validator import validate_sql

router = APIRouter()
context_manager = ContextManager()
agent = Agent(context_manager)

@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
 pass

@router.post("/message")
async def send_message(message: dict):
 pass

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
 pass
