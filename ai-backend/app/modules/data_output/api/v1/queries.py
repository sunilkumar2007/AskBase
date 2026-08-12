import time
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status, HTTPException, Query as QueryParam
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.query import (
    QueryExecuteRequest,
    QueryResultResponse,
    QueryResultDataResponse,
    QueryResponse,
    QueryHistoryResponse,
    SavedQueryCreate,
    SavedQueryUpdate,
    SavedQueryResponse,
)
from app.modules.data_output.services.query_service import QueryService
from app.modules.data_output.db.models.query import Query as QueryModel, SavedQuery


router = APIRouter(prefix="/projects/{project_id}/queries", tags=["Queries & Execution"])


@router.post("/execute", response_model=QueryResultDataResponse, status_code=status.HTTP_201_CREATED)
async def execute_query(
    project_id: uuid.UUID,
    req: QueryExecuteRequest,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Log and execute SQL query with SQLGlot validation, connection-scoped statement timeout, and bounded streaming fetch."""
    query_rec, is_read_only, tables = await QueryService.create_query_record(
        db=db,
        project_id=project_id,
        user_id=user_id,
        raw_sql=req.raw_sql,
        chat_id=req.chat_id,
        dialect=req.dialect,
    )

    if not is_read_only:
        await QueryService.record_query_result(
            db=db,
            query_id=query_rec.id,
            columns=[],
            row_count=0,
            execution_time_ms=0.0,
            status="rejected",
            error_message="Query rejected by SQLGlot validation boundary: non-read-only statement detected",
        )
        raise HTTPException(
            status_code=400,
            detail="Forbidden query: statement is not a read-only SELECT or CTE",
        )

    try:
        result_record, columns, rows, is_truncated = await QueryService.execute_read_only_query(
            db=db,
            query=query_rec,
            parameters=req.parameters,
        )

        return QueryResultDataResponse(
            id=result_record.id,
            query_id=query_rec.id,
            columns=columns,
            rows=rows,
            row_count=len(rows),
            execution_time_ms=result_record.execution_time_ms,
            is_truncated=is_truncated,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/history", response_model=QueryHistoryResponse)
async def get_query_history(
    project_id: uuid.UUID,
    page: int = QueryParam(1, ge=1),
    page_size: int = QueryParam(20, ge=1, le=100),
    chat_id: Optional[uuid.UUID] = None,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Get paginated execution history of queries in project."""
    stmt = select(QueryModel).where(QueryModel.project_id == project_id)
    if chat_id:
        stmt = stmt.where(QueryModel.chat_id == chat_id)

    cnt_stmt = select(func.count()).select_from(stmt.subquery())
    total_count = (await db.execute(cnt_stmt)).scalar() or 0

    stmt = stmt.order_by(QueryModel.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    items = (await db.execute(stmt)).scalars().all()

    return QueryHistoryResponse(
        items=items,
        total_count=total_count,
        page=page,
        page_size=page_size,
    )


@router.get("/{query_id}", response_model=QueryResponse)
async def get_query_detail(
    project_id: uuid.UUID,
    query_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve details of a logged query."""
    res = await db.execute(
        select(QueryModel).where(QueryModel.id == query_id, QueryModel.project_id == project_id)
    )
    query_rec = res.scalar_one_or_none()
    if not query_rec:
        raise HTTPException(status_code=404, detail="Query record not found")
    return query_rec


@router.post("/saved", response_model=SavedQueryResponse, status_code=status.HTTP_201_CREATED)
async def create_saved_query(
    project_id: uuid.UUID,
    saved_in: SavedQueryCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Save a reusable query template."""
    sq = SavedQuery(
        project_id=project_id,
        name=saved_in.name,
        description=saved_in.description,
        sql_template=saved_in.sql_template,
        parameters_schema=saved_in.parameters_schema,
        created_by=user_id,
    )
    db.add(sq)
    await db.flush()
    return sq


@router.get("/saved", response_model=List[SavedQueryResponse])
async def list_saved_queries(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List saved query templates in project."""
    res = await db.execute(select(SavedQuery).where(SavedQuery.project_id == project_id))
    return res.scalars().all()


@router.delete("/saved/{saved_query_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saved_query(
    project_id: uuid.UUID,
    saved_query_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Delete a saved query template."""
    res = await db.execute(
        select(SavedQuery).where(SavedQuery.id == saved_query_id, SavedQuery.project_id == project_id)
    )
    sq = res.scalar_one_or_none()
    if not sq:
        raise HTTPException(status_code=404, detail="Saved query template not found")

    await db.delete(sq)
    await db.flush()
