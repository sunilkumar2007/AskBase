"""AskBase AI Backend - Files routes.

File upload, retrieval, and deletion.
"""
from __future__ import annotations

import logging
import os
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_current_user

logger = logging.getLogger("askbase")

router = APIRouter()

UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "data-output/uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_claims: dict[str, Any] = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Upload a file to the project."""
    user_id = user_claims.get("sub", "")
    file_id = str(uuid.uuid4())
    safe_name = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        await session.execute(
            """
            INSERT INTO uploaded_files (id, user_id, filename, file_path, file_size, content_type)
            VALUES (:id, :uid, :fn, :fp, :fs, :ct)
            RETURNING id, filename, file_path, file_size, content_type, created_at
            """,
            {
                "id": file_id,
                "uid": user_id,
                "fn": file.filename,
                "fp": file_path,
                "fs": len(contents),
                "ct": file.content_type,
            },
        )
        await session.commit()
        return {"file_id": file_id, "filename": file.filename, "path": file_path}
    except Exception:
        logger.exception("File upload failed.")
        raise HTTPException(500, "Failed to upload file.")


@router.get("/{file_id}")
async def get_file(
    file_id: str,
    user_claims: dict[str, Any] = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Get file metadata and download URL."""
    try:
        result = await session.execute(
            """
            SELECT id, filename, file_path, file_size, content_type, created_at
            FROM uploaded_files
            WHERE id = :fid AND user_id = :uid
            """,
            {"fid": file_id, "uid": user_claims.get("sub", "")},
        )
        row = result.mappings().first()
        if not row:
            raise HTTPException(404, "File not found.")
        return dict(row)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to get file.")
        raise HTTPException(500, "Failed to get file.")


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    user_claims: dict[str, Any] = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Delete a file."""
    try:
        result = await session.execute(
            """
            SELECT file_path FROM uploaded_files WHERE id = :fid AND user_id = :uid
            """,
            {"fid": file_id, "uid": user_claims.get("sub", "")},
        )
        row = result.mappings().first()
        if not row:
            raise HTTPException(404, "File not found.")

        file_path = row["file_path"]
        if os.path.exists(file_path):
            os.remove(file_path)

        await session.execute(
            """
            DELETE FROM uploaded_files WHERE id = :fid AND user_id = :uid
            """,
            {"fid": file_id, "uid": user_claims.get("sub", "")},
        )
        await session.commit()
        return {"deleted": True}
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to delete file.")
        raise HTTPException(500, "Failed to delete file.")
