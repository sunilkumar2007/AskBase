import pytest
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

from app.modules.data_output.exporters import get_exporter
from app.modules.data_output.services.export_service import ExportService, MAX_EXPORT_ROWS
from app.modules.data_output.db.models.data import File
from app.modules.data_output.db.models.exports import GeneratedFile
from app.modules.data_output.db.models.lineage import DataLineage


@pytest.mark.asyncio
async def test_csv_exporter():
    exporter = get_exporter("csv")
    cols = ["id", "name", "score"]
    rows = [[1, "Alice", 95.5], [2, "Bob", 88.0]]
    result = await exporter.export_query_results(cols, rows, title="Test Results")
    text_content = result.decode("utf-8")
    assert "id,name,score" in text_content
    assert "Alice" in text_content
    assert "Bob" in text_content


@pytest.mark.asyncio
async def test_json_exporter():
    exporter = get_exporter("json")
    cols = ["id", "city"]
    rows = [[101, "New York"], [102, "London"]]
    result = await exporter.export_query_results(cols, rows, title="City Test")
    text_content = result.decode("utf-8")
    assert "New York" in text_content
    assert "London" in text_content


@pytest.mark.asyncio
async def test_xlsx_exporter():
    exporter = get_exporter("xlsx")
    cols = ["Product", "Price"]
    rows = [["Laptop", 1200], ["Phone", 800]]
    result = await exporter.export_query_results(cols, rows, title="Sales")
    assert isinstance(result, bytes)
    assert len(result) > 0


@pytest.mark.asyncio
async def test_pdf_exporter():
    exporter = get_exporter("pdf")
    cols = ["Metric", "Value"]
    rows = [["Conversion", "12%"]]
    result = await exporter.export_query_results(cols, rows, title="PDF Test")
    assert isinstance(result, bytes)
    assert len(result) > 0


@pytest.mark.asyncio
async def test_pptx_exporter():
    exporter = get_exporter("pptx")
    cols = ["Category", "Total"]
    rows = [["Tech", 5000]]
    result = await exporter.export_query_results(cols, rows, title="Presentation Test")
    assert isinstance(result, bytes)
    assert len(result) > 0


@pytest.mark.asyncio
async def test_export_service_end_to_end():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(lambda sync_conn: File.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: GeneratedFile.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: DataLineage.__table__.create(sync_conn, checkfirst=True))

    async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_factory() as session:
        project_id = uuid.uuid4()
        user_id = uuid.uuid4()
        cols = ["ColA", "ColB"]
        rows = [["ValA1", "ValB1"], ["ValA2", "ValB2"]]

        for fmt in ["csv", "json", "xlsx", "pdf", "pptx"]:
            gen_file, download_url = await ExportService.generate_export(
                db=session,
                project_id=project_id,
                user_id=user_id,
                file_format=fmt,
                columns=cols,
                rows=rows,
                export_type="dataset",
                title=f"Test_{fmt.upper()}",
            )
            assert gen_file.id is not None
            assert gen_file.export_type == fmt
            assert "askbase-exports" in download_url or fmt in download_url

    await engine.dispose()


@pytest.mark.asyncio
async def test_export_row_limit_error():
    oversized_rows = [["val"]] * (MAX_EXPORT_ROWS + 1)
    with pytest.raises(ValueError, match="exceeds maximum allowed limit"):
        await ExportService.generate_export(
            db=None,
            project_id=uuid.uuid4(),
            user_id=uuid.uuid4(),
            file_format="csv",
            columns=["col"],
            rows=oversized_rows,
        )
