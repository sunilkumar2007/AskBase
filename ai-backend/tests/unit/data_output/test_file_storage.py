import pytest
import uuid
from app.modules.data_output.services.file_service import FileService, MAX_UPLOAD_SIZE_BYTES
from app.modules.data_output.storage import get_storage_driver, LocalStorageDriver


def test_calculate_checksum():
    content = b"hello askbase storage"
    checksum = FileService.calculate_checksum(content)
    assert isinstance(checksum, str)
    assert len(checksum) == 64  # SHA-256 length


def test_storage_driver_factory():
    driver = get_storage_driver()
    assert isinstance(driver, LocalStorageDriver)


@pytest.mark.asyncio
async def test_local_storage_driver_crud():
    driver = LocalStorageDriver()
    bucket = "test-bucket"
    path = "project1/file1.txt"
    content = b"Sample byte content for storage test"

    # Upload
    res_path = await driver.upload_file(bucket, path, content, "text/plain")
    assert res_path == path

    # Download
    read_content = await driver.download_file(bucket, path)
    assert read_content == content

    # Signed URL
    url = await driver.generate_signed_url(bucket, path)
    assert "test-bucket" in url

    # Delete
    deleted = await driver.delete_file(bucket, path)
    assert deleted is True


@pytest.mark.asyncio
async def test_file_size_validation_error():
    oversized = b"X" * (MAX_UPLOAD_SIZE_BYTES + 1)
    with pytest.raises(ValueError, match="exceeds maximum allowed limit"):
        # We pass None for db since validation happens before DB insert
        await FileService.save_uploaded_file(
            db=None,
            project_id=uuid.uuid4(),
            user_id=uuid.uuid4(),
            filename="large.bin",
            file_content=oversized,
        )
