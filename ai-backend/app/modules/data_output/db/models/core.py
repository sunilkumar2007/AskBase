import uuid
from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.modules.data_output.db.base import Base, UUIDMixin, TimestampMixin, JSON_TYPE


class Profile(Base, UUIDMixin, TimestampMixin):
    """User Profile table mirror for Supabase Auth integration."""

    __tablename__ = "profiles"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    created_projects: Mapped[List["Project"]] = relationship(
        "Project", back_populates="creator", cascade="all, delete-orphan"
    )
    memberships: Mapped[List["ProjectMember"]] = relationship(
        "ProjectMember", back_populates="user", cascade="all, delete-orphan"
    )


class Project(Base, UUIDMixin, TimestampMixin):
    """Project workspace container."""

    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )
    settings: Mapped[dict] = mapped_column(JSON_TYPE, default=dict, nullable=False)

    # Relationships
    creator: Mapped["Profile"] = relationship("Profile", back_populates="created_projects")
    members: Mapped[List["ProjectMember"]] = relationship(
        "ProjectMember", back_populates="project", cascade="all, delete-orphan"
    )


class ProjectMember(Base, UUIDMixin):
    """Project membership and role authorization."""

    __tablename__ = "project_members"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )
    role: Mapped[str] = mapped_column(
        String(50), default="viewer", nullable=False
    )  # owner, editor, viewer
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="members")
    user: Mapped["Profile"] = relationship("Profile", back_populates="memberships")

    __table_args__ = (
        UniqueConstraint("project_id", "user_id", name="uq_project_user_member"),
        Index("idx_project_members_lookup", "project_id", "user_id"),
        *([Base.__table_args__] if Base.__table_args__ else []),
    )
