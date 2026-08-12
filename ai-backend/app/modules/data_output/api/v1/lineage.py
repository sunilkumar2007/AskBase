import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.lineage import LineageGraphResponse
from app.modules.data_output.services.lineage_service import LineageService

router = APIRouter(prefix="/projects/{project_id}/lineage", tags=["Data Lineage"])


@router.get("", response_model=LineageGraphResponse)
async def get_project_lineage(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve data lineage provenance graph for project."""
    graph = await LineageService.get_project_lineage(db, project_id)
    return graph
