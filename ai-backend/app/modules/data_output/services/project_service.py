import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.db.models.core import Project, ProjectMember, Profile
from app.modules.data_output.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    """Service managing project persistence and membership authorization."""

    @staticmethod
    async def get_project(db: AsyncSession, project_id: uuid.UUID) -> Optional[Project]:
        result = await db.execute(select(Project).where(Project.id == project_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def create_project(
        db: AsyncSession, user_id: uuid.UUID, project_in: ProjectCreate
    ) -> Project:
        # Ensure user profile exists in mirror
        prof_res = await db.execute(select(Profile).where(Profile.id == user_id))
        profile = prof_res.scalar_one_or_none()
        if not profile:
            profile = Profile(id=user_id, email=f"user_{user_id}@askbase.internal")
            db.add(profile)
            await db.flush()

        project = Project(
            name=project_in.name,
            description=project_in.description,
            settings=project_in.settings,
            created_by=user_id,
        )
        db.add(project)
        await db.flush()

        # Add owner membership
        member = ProjectMember(
            project_id=project.id,
            user_id=user_id,
            role="owner",
        )
        db.add(member)
        await db.flush()
        return project

    @staticmethod
    async def check_user_access(
        db: AsyncSession, project_id: uuid.UUID, user_id: uuid.UUID, required_role: str = "viewer"
    ) -> bool:
        result = await db.execute(
            select(ProjectMember).where(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id,
            )
        )
        member = result.scalar_one_or_none()
        if not member:
            return False

        if required_role == "viewer":
            return True
        if required_role == "editor":
            return member.role in ("owner", "editor")
        if required_role == "owner":
            return member.role == "owner"
        return False
