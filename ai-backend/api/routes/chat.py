"""AskBase AI Backend - Chat routes.

WebSocket + REST endpoints for the conversational interface.
"""
from __future__ import annotations

import json
import logging
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.agent.agent import Agent
from app.agent.context import AgentContext
from app.api.dependencies import get_db, get_current_user, get_current_project
from app.database.connection import get_session

logger = logging.getLogger("askbase")

router = APIRouter()
_agent = Agent()


@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
 """Real-time chat via WebSocket."""
 await websocket.accept()
 try:
 while True:
 raw = await websocket.receive_text()
 message = json.loads(raw)
 question = message.get("message", "")
 project_id = message.get("project_id", "")

 if not question:
 await websocket.send_json({"error": "Empty message."})
 continue

 # Authenticate from header sent during handshake
 auth_header = websocket.headers.get("authorization", "")
 claims = await get_current_user.__wrapped__(auth_header) if hasattr(get_current_user, "__wrapped__") else None
 if claims is None:
 await websocket.send_json({"error": "Unauthorized."})
 continue

 async for session in get_session():
 context = AgentContext(project_id=project_id, user_id=claims.get("sub", ""))
 try:
 result = await _agent.process_question(session, context, question)
 await websocket.send_json(result)
 except Exception as exc:
 logger.exception("WebSocket processing error.")
 await websocket.send_json({"error": str(exc), "sql": "", "data": {"columns": [], "rows": []}})

 except WebSocketDisconnect:
 logger.info("WebSocket session %s disconnected.", session_id)
 except Exception:
 logger.exception("WebSocket error.")


@router.post("/message")
async def send_message(
 payload: dict[str, Any],
 session: AsyncSession = Depends(get_db),
 project: dict[str, Any] = Depends(get_current_project),
 user_claims: dict[str, Any] = Depends(get_current_user),
 ):
 """REST endpoint for chat — processes one question."""
 question = payload.get("message", "")
 if not question:
 raise HTTPException(400, "Empty message.")

 context = AgentContext(
 project_id=project["id"],
 user_id=user_claims.get("sub", ""),
 database_url=project.get("database_url", ""),
 )
 result = await _agent.process_question(session, context, question)
 return result


@router.get("/history/{project_id}")
async def get_chat_history(
 project_id: str,
 session: AsyncSession = Depends(get_db),
 project: dict[str, Any] = Depends(get_current_project),
 user_claims: dict[str, Any] = Depends(get_current_user),
 ):
 """Return conversation history for a project."""
 try:
 result = await session.execute(
 """
 SELECT id, user_message, sql, response, created_at
 FROM chat_sessions
 WHERE project_id = :pid AND user_id = :uid
 ORDER BY created_at DESC
 LIMIT 50
 """,
 {"pid": project_id, "uid": user_claims.get("sub", "")},
 )
 rows = result.mappings().fetchall()
 return {"history": [dict(r) for r in rows]}
 except Exception:
 logger.exception("Failed to load chat history.")
 return {"history": []}
