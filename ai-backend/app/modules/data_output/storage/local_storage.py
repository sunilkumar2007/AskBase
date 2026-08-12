import os
import asyncio
from pathlib import Path
from typing import Optional
from app.modules.data_output.storage.base_storage import BaseStorageDriver
from app.modules.data_output.config import settings

try:
    import aiofiles
    HAS_AIOFILES = True
except ImportError:
    HAS_AIOFILES = False


class LocalStorageDriver(BaseStorageDriver):
    """Local filesystem implementation of storage driver for offline dev/test."""

    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = Path(base_dir or settings.LOCAL_STORAGE_DIR)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _get_path(self, bucket_name: str, storage_path: str) -> Path:
        full_path = self.base_dir / bucket_name / storage_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        return full_path

    async def upload_file(
        self,
        bucket_name: str,
        storage_path: str,
        file_content: bytes,
        content_type: str = "application/octet-stream",
    ) -> str:
        target_path = self._get_path(bucket_name, storage_path)
        if HAS_AIOFILES:
            async with aiofiles.open(target_path, "wb") as f:
                await f.write(file_content)
        else:
            def _write():
                with open(target_path, "wb") as f:
                    f.write(file_content)
            await asyncio.to_thread(_write)
        return storage_path

    async def download_file(
        self, bucket_name: str, storage_path: str
    ) -> bytes:
        target_path = self._get_path(bucket_name, storage_path)
        if not target_path.exists():
            raise FileNotFoundError(f"File not found at {target_path}")
        if HAS_AIOFILES:
            async with aiofiles.open(target_path, "rb") as f:
                return await f.read()
        else:
            def _read():
                with open(target_path, "rb") as f:
                    return f.read()
            return await asyncio.to_thread(_read)

    async def generate_signed_url(
        self, bucket_name: str, storage_path: str, expires_in_seconds: int = 3600
    ) -> str:
        target_path = self._get_path(bucket_name, storage_path)
        return f"/api/v1/data-output/files/local-stream?bucket={bucket_name}&path={storage_path}"

    async def delete_file(self, bucket_name: str, storage_path: str) -> bool:
        target_path = self._get_path(bucket_name, storage_path)
        if target_path.exists():
            target_path.unlink()
            return True
        return False
