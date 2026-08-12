import uuid
from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.data_output.db.session import AsyncSessionFactory
from app.modules.data_output.services.project_service import ProjectService


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding an async database session."""
    async with AsyncSessionFactory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_current_user_id(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    authorization: Optional[str] = Header(None, alias="Authorization"),
) -> uuid.UUID:
    """
    FastAPI dependency extracting current user ID from X-User-ID header or Bearer Token.
    Defaults to a mock user ID in development mode if unauthenticated header is omitted.
    """
    if x_user_id:
        try:
            return uuid.UUID(x_user_id)
        except ValueError:
            pass

    if authorization and authorization.startswith("Bearer "):
        # Placeholder JWT token extraction / decoded sub claim
        token = authorization.split(" ")[1]
        try:
            return uuid.UUID(token[:36])
        except ValueError:
            pass

    # Development fallback default user ID
    return uuid.UUID("00000000-0000-0000-0000-000000000001")


def require_project_role(required_role: str = "viewer"):
    """Factory dependency enforcing project membership role authorization."""

    async def _check_access(
        project_id: uuid.UUID,
        user_id: uuid.UUID = Depends(get_current_user_id),
        db: AsyncSession = Depends(get_db),
    ) -> uuid.UUID:
        has_access = await ProjectService.check_user_access(
            db=db, project_id=project_id, user_id=user_id, required_role=required_role
        )
        if not has_access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Requires '{required_role}' access on project {project_id}",
            )
        return user_id

    return _check_access
