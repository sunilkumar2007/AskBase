import uuid
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.report import (
    ReportCreate,
    ReportUpdate,
    ReportResponse,
    ReportDetailResponse,
    ReportExportRequest,
)
from app.modules.data_output.schemas.export import ExportDownloadUrlResponse
from app.modules.data_output.services.report_service import ReportService

router = APIRouter(prefix="/projects/{project_id}/reports", tags=["Reports"])


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    project_id: uuid.UUID,
    report_in: ReportCreate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Create a new structured report."""
    try:
        report = await ReportService.create_report(
            db=db,
            project_id=project_id,
            user_id=user_id,
            title=report_in.title,
            description=report_in.description,
            content_structure=report_in.content_structure,
        )
        return report
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=List[ReportResponse])
async def list_reports(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List all reports in project."""
    return await ReportService.list_reports(db, project_id)


@router.get("/{report_id}", response_model=ReportDetailResponse)
async def get_report(
    project_id: uuid.UUID,
    report_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve report detail."""
    report = await ReportService.get_report(db, project_id, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.put("/{report_id}", response_model=ReportResponse)
async def update_report(
    project_id: uuid.UUID,
    report_id: uuid.UUID,
    report_update: ReportUpdate,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Update report title, description, or content structure."""
    try:
        report = await ReportService.update_report(
            db=db,
            project_id=project_id,
            report_id=report_id,
            title=report_update.title,
            description=report_update.description,
            content_structure=report_update.content_structure,
        )
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    project_id: uuid.UUID,
    report_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Delete report record. Preserves generated export files."""
    deleted = await ReportService.delete_report(db, project_id, report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")


@router.post("/{report_id}/export", response_model=ExportDownloadUrlResponse, status_code=status.HTTP_201_CREATED)
async def export_report(
    project_id: uuid.UUID,
    report_id: uuid.UUID,
    req: ReportExportRequest,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Export report document (PDF, PPTX, XLSX) and generate signed download URL."""
    try:
        gen_file, download_url = await ReportService.export_report(
            db=db,
            project_id=project_id,
            user_id=user_id,
            report_id=report_id,
            file_format=req.file_format,
            options=req.options,
        )
        return ExportDownloadUrlResponse(
            export_id=gen_file.id,
            file_id=gen_file.file_id,
            download_url=download_url,
            expires_in_seconds=3600,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
