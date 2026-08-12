from app.modules.data_output.config import settings
from app.modules.data_output.storage.base_storage import BaseStorageDriver
from app.modules.data_output.storage.local_storage import LocalStorageDriver


def get_storage_driver() -> BaseStorageDriver:
    """Factory function to resolve active storage driver based on settings."""
    if settings.STORAGE_DRIVER == "supabase":
        try:
            from app.modules.data_output.storage.supabase_storage import SupabaseStorageDriver
            return SupabaseStorageDriver()
        except Exception:
            # Fallback to local storage if supabase driver fails to instantiate
            return LocalStorageDriver()
    return LocalStorageDriver()


__all__ = ["BaseStorageDriver", "LocalStorageDriver", "get_storage_driver"]
