import uuid
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.chat import ChatCreate, ChatResponse, MessageCreate, MessageResponse
from app.modules.data_output.db.models.conversation import Chat, Message

router = APIRouter(prefix="/projects/{project_id}/chats", tags=["Chats & History"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(
    project_id: uuid.UUID,
    chat_in: ChatCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Create a new chat conversation thread in project."""
    chat = Chat(
        project_id=project_id,
        title=chat_in.title or "New Conversation",
        created_by=user_id,
    )
    db.add(chat)
    await db.flush()
    return chat


@router.get("", response_model=List[ChatResponse])
async def list_chats(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List chat threads in project."""
    res = await db.execute(select(Chat).where(Chat.project_id == project_id))
    return res.scalars().all()


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def add_message(
    project_id: uuid.UUID,
    chat_id: uuid.UUID,
    msg_in: MessageCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Add a message to chat history."""
    msg = Message(
        chat_id=chat_id,
        sender_role=msg_in.sender_role,
        content=msg_in.content,
        metadata_json=msg_in.metadata_json,
    )
    db.add(msg)
    await db.flush()
    return msg


@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_chat_messages(
    project_id: uuid.UUID,
    chat_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve message history for a chat thread."""
    res = await db.execute(
        select(Message).where(Message.chat_id == chat_id).order_by(Message.created_at.asc())
    )
    return res.scalars().all()
