import uuid
from typing import Optional, List
from sqlalchemy import String, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin, JSON_TYPE


class Chat(Base, UUIDMixin, TimestampMixin):
    """Conversation thread model."""

    __tablename__ = "chats"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), default="New Conversation", nullable=False)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )

    messages: Mapped[List["Message"]] = relationship(
        "Message", back_populates="chat", cascade="all, delete-orphan"
    )


class Message(Base, UUIDMixin, TimestampMixin):
    """Message item inside a chat thread."""

    __tablename__ = "messages"

    chat_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sender_role: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # user, assistant, system
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)

    chat: Mapped["Chat"] = relationship("Chat", back_populates="messages")

    __table_args__ = (
        Index("idx_messages_chat_seq", "chat_id", "created_at"),
        *([Base.__table_args__] if Base.__table_args__ else []),
    )
