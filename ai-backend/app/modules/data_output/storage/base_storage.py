from abc import ABC, abstractmethod
from typing import Optional, BinaryIO


class BaseStorageDriver(ABC):
    """Abstract interface for object storage drivers."""

    @abstractmethod
    async def upload_file(
        self,
        bucket_name: str,
        storage_path: str,
        file_content: bytes,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Upload file content and return relative storage path."""
        pass

    @abstractmethod
    async def download_file(
        self, bucket_name: str, storage_path: str
    ) -> bytes:
        """Download file content from storage."""
        pass

    @abstractmethod
    async def generate_signed_url(
        self, bucket_name: str, storage_path: str, expires_in_seconds: int = 3600
    ) -> str:
        """Generate temporary signed URL for file access."""
        pass

    @abstractmethod
    async def delete_file(self, bucket_name: str, storage_path: str) -> bool:
        """Delete file from storage."""
        pass
