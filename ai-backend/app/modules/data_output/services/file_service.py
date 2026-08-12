import hashlib
import uuid
from typing import Optional, Tuple, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.db.models.data import File
from app.modules.data_output.storage import get_storage_driver
from app.modules.data_output.config import settings

MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024  # 100 MB limit


class FileService:
    """Service handling file upload, checksum deduplication, two-phase rollback, and storage drivers."""

    @staticmethod
    def calculate_checksum(file_content: bytes) -> str:
        """Calculate SHA-256 hex digest of file payload."""
        return hashlib.sha256(file_content).hexdigest()

    @staticmethod
    async def find_duplicate_checksum(
        db: AsyncSession, project_id: uuid.UUID, checksum: str
    ) -> Optional[File]:
        """Check for existing file with identical checksum within project."""
        res = await db.execute(
            select(File).where(File.project_id == project_id, File.checksum == checksum)
        )
        return res.scalar_one_or_none()

    @staticmethod
    async def save_uploaded_file(
        db: AsyncSession,
        project_id: uuid.UUID,
        user_id: uuid.UUID,
        filename: str,
        file_content: bytes,
        mime_type: str = "application/octet-stream",
        bucket_name: Optional[str] = None,
    ) -> File:
        """
        Upload file with two-phase transaction rollback:
        1. Validate file size
        2. Compute SHA-256 checksum
        3. Upload payload to Storage driver
        4. Insert metadata record in data_output.files DB
        5. If DB insert fails, issue compensation delete in Storage driver.
        """
        if len(file_content) > MAX_UPLOAD_SIZE_BYTES:
            raise ValueError(f"File size {len(file_content)} bytes exceeds maximum allowed limit of {MAX_UPLOAD_SIZE_BYTES} bytes")

        bucket = bucket_name or settings.STORAGE_BUCKET_UPLOADS
        checksum = FileService.calculate_checksum(file_content)
        file_id = uuid.uuid4()
        
        # Sanitize filename
        safe_filename = filename.replace("/", "_").replace("\\", "_")
        storage_path = f"{project_id}/{file_id}_{safe_filename}"

        driver = get_storage_driver()

        # Phase 1: Upload to Storage Driver
        await driver.upload_file(
            bucket_name=bucket,
            storage_path=storage_path,
            file_content=file_content,
            content_type=mime_type,
        )

        # Phase 2: Persist Metadata Record to Database
        try:
            file_record = File(
                id=file_id,
                project_id=project_id,
                filename=safe_filename,
                storage_path=storage_path,
                bucket_name=bucket,
                mime_type=mime_type,
                file_size_bytes=len(file_content),
                checksum=checksum,
                metadata_json={"original_filename": filename},
                created_by=user_id,
            )
            db.add(file_record)
            await db.flush()
            return file_record
        except Exception:
            # Compensation Rollback: Delete stored object if DB write fails
            try:
                await driver.delete_file(bucket_name=bucket, storage_path=storage_path)
            except Exception:
                pass
            raise

    @staticmethod
    async def get_download_url(
        db: AsyncSession, file_id: uuid.UUID, expires_in_seconds: int = 3600
    ) -> Tuple[File, str]:
        """Retrieve file metadata and generate short-lived signed URL."""
        res = await db.execute(select(File).where(File.id == file_id))
        file_record = res.scalar_one_or_none()
        if not file_record:
            raise FileNotFoundError(f"File record {file_id} not found")

        driver = get_storage_driver()
        url = await driver.generate_signed_url(
            bucket_name=file_record.bucket_name,
            storage_path=file_record.storage_path,
            expires_in_seconds=expires_in_seconds,
        )
        return (file_record, url)

    @staticmethod
    async def delete_file_record(
        db: AsyncSession, file_id: uuid.UUID
    ) -> bool:
        """Delete file record from DB and physical object from storage driver."""
        res = await db.execute(select(File).where(File.id == file_id))
        file_record = res.scalar_one_or_none()
        if not file_record:
            return False

        driver = get_storage_driver()
        await driver.delete_file(
            bucket_name=file_record.bucket_name,
            storage_path=file_record.storage_path,
        )

        await db.delete(file_record)
        await db.flush()
        return True
