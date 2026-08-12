from typing import Optional
from app.modules.data_output.storage.base_storage import BaseStorageDriver
from app.modules.data_output.config import settings

try:
    from supabase import create_client, Client
except ImportError:
    Client = None


class SupabaseStorageDriver(BaseStorageDriver):
    """Supabase Storage driver implementation using supabase-py SDK."""

    def __init__(self):
        if not settings.SUPABASE_URL or not (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY):
            raise ValueError("Supabase URL and API keys must be configured for Supabase Storage driver")
        
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
        if Client is None:
            raise ImportError("supabase package is required for SupabaseStorageDriver")
        self.client: Client = create_client(settings.SUPABASE_URL, key)

    async def upload_file(
        self,
        bucket_name: str,
        storage_path: str,
        file_content: bytes,
        content_type: str = "application/octet-stream",
    ) -> str:
        res = self.client.storage.from_(bucket_name).upload(
            file=file_content,
            path=storage_path,
            file_options={"content-type": content_type, "upsert": "true"},
        )
        return storage_path

    async def download_file(
        self, bucket_name: str, storage_path: str
    ) -> bytes:
        res = self.client.storage.from_(bucket_name).download(storage_path)
        return res

    async def generate_signed_url(
        self, bucket_name: str, storage_path: str, expires_in_seconds: int = 3600
    ) -> str:
        res = self.client.storage.from_(bucket_name).create_signed_url(
            path=storage_path, expires_in=expires_in_seconds
        )
        if isinstance(res, dict) and "signedURL" in res:
            return res["signedURL"]
        elif hasattr(res, "signed_url"):
            return res.signed_url
        return str(res)

    async def delete_file(self, bucket_name: str, storage_path: str) -> bool:
        self.client.storage.from_(bucket_name).remove([storage_path])
        return True
