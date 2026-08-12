import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status, HTTPException, Request, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.dependencies import get_db, require_project_role
from app.modules.data_output.schemas.file import FileResponse, FileDownloadUrlResponse
from app.modules.data_output.services.file_service import FileService
from app.modules.data_output.db.models.data import File as FileModel

router = APIRouter(prefix="/projects/{project_id}/files", tags=["Files & Storage"])


@router.post("/upload", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    project_id: uuid.UUID,
    request: Request,
    filename: Optional[str] = None,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Upload and register file metadata in project."""
    content_type = request.headers.get("content-type", "application/octet-stream")
    
    # Extract file content from multipart or raw body
    if "multipart/form-data" in content_type:
        try:
            form = await request.form()
            file_obj = form.get("file")
            if file_obj and hasattr(file_obj, "read"):
                content = await file_obj.read()
                filename = filename or getattr(file_obj, "filename", "uploaded_file")
            else:
                content = await request.body()
                filename = filename or "uploaded_file"
        except Exception:
            content = await request.body()
            filename = filename or "uploaded_file"
    else:
        content = await request.body()
        filename = filename or "uploaded_file"

    file_record = await FileService.save_uploaded_file(
        db=db,
        project_id=project_id,
        user_id=user_id,
        filename=filename or "uploaded_file",
        file_content=content,
        mime_type=content_type,
    )
    return file_record


@router.get("", response_model=List[FileResponse])
async def list_files(
    project_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """List files registered in project."""
    res = await db.execute(select(FileModel).where(FileModel.project_id == project_id))
    return res.scalars().all()


@router.get("/{file_id}/download", response_model=FileDownloadUrlResponse)
async def get_file_download_url(
    project_id: uuid.UUID,
    file_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("viewer")),
    db: AsyncSession = Depends(get_db),
):
    """Generate temporary signed URL for file download."""
    try:
        file_record, download_url = await FileService.get_download_url(db, file_id)
        return FileDownloadUrlResponse(
            file_id=file_record.id,
            filename=file_record.filename,
            download_url=download_url,
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    project_id: uuid.UUID,
    file_id: uuid.UUID,
    user_id: uuid.UUID = Depends(require_project_role("editor")),
    db: AsyncSession = Depends(get_db),
):
    """Delete file record from database and storage bucket."""
    deleted = await FileService.delete_file_record(db, file_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="File not found")
