import uuid
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.export import (
    ExportGenerateRequest,
    ExportResponse,
    ExportDownloadUrlResponse,
)
from app.modules.data_output.services.export_service import ExportService
from app.modules.data_output.db.models.exports import GeneratedFile

router = APIRouter(prefix="/projects/{project_id}/exports", tags=["Exporters"])


@router.post("/generate", response_model=ExportResponse, status_code=status.HTTP_201_CREATED)
async def generate_export(
    project_id: uuid.UUID,
    req: ExportGenerateRequest,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Generate multi-format document export (CSV, JSON, Excel/XLSX, PDF, PPTX) and upload to askbase-exports storage bucket."""
    sample_cols = req.columns or ["ID", "Metric", "Value", "Status"]
    sample_rows = req.rows or [
        [1, "Total Users", 1250, "Active"],
        [2, "Monthly Revenue", "$45,200", "Growth"],
        [3, "Query Latency", "12ms", "Optimal"],
    ]

    try:
        gen_file, download_url = await ExportService.generate_export(
            db=db,
            project_id=project_id,
            user_id=user_id,
            file_format=req.file_format,
            columns=sample_cols,
            rows=sample_rows,
            export_type=req.export_type,
            title=req.title or "ASKBASE Export",
            report_id=req.report_id,
            dashboard_id=req.dashboard_id,
            options=req.options,
        )

        res_data = ExportResponse.model_validate(gen_file)
        res_data.download_url = download_url
        return res_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export generation failed: {str(e)}")


@router.get("", response_model=List[ExportResponse])
async def list_exports(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List generated export files in project."""
    res = await db.execute(select(GeneratedFile).where(GeneratedFile.project_id == project_id))
    return res.scalars().all()


@router.get("/{export_id}/download", response_model=ExportDownloadUrlResponse)
async def get_export_download_url(
    project_id: uuid.UUID,
    export_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Generate temporary signed download URL for generated export file."""
    try:
        gen_file, download_url = await ExportService.get_export_download_url(db, export_id)
        return ExportDownloadUrlResponse(
            export_id=gen_file.id,
            file_format=gen_file.file_format,
            download_url=download_url,
            expires_in_seconds=3600,
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Export record not found")
