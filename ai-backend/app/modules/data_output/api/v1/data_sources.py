import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.data_source import DataSourceCreate, DataSourceResponse
from app.modules.data_output.db.models.data import DataSource

router = APIRouter(prefix="/projects/{project_id}/data-sources", tags=["Data Sources"])


@router.post("", response_model=DataSourceResponse, status_code=status.HTTP_201_CREATED)
async def create_data_source(
    project_id: uuid.UUID,
    data_source_in: DataSourceCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Register data source metadata in project."""
    ds = DataSource(
        project_id=project_id,
        name=data_source_in.name,
        type=data_source_in.type,
        connection_config_encrypted=data_source_in.connection_config_encrypted,
        schema_metadata=data_source_in.schema_metadata,
    )
    db.add(ds)
    await db.flush()
    return ds


@router.get("", response_model=List[DataSourceResponse])
async def list_data_sources(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List data sources configured for project."""
    res = await db.execute(select(DataSource).where(DataSource.project_id == project_id))
    return res.scalars().all()
