import pytest
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.modules.data_output.services.report_service import ReportService
from app.modules.data_output.db.models.analytics import Report, Chart, Insight
from app.modules.data_output.db.models.query import Query, QueryResult
from app.modules.data_output.db.models.exports import GeneratedFile
from app.modules.data_output.db.models.data import File
from app.modules.data_output.db.models.lineage import DataLineage
from app.modules.data_output.integration.module1_contracts import (
    FrontendChartSpecDTO,
    FrontendDashboardLayoutDTO,
    FrontendReportDocumentDTO,
)
from app.modules.data_output.integration.module2_contracts import (
    AgentQueryExecutionPayload,
    validate_agent_sql,
)


@pytest.mark.asyncio
async def test_report_crud_and_validation():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(lambda sync_conn: Report.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: Query.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: QueryResult.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: Chart.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: Insight.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: File.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: GeneratedFile.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: DataLineage.__table__.create(sync_conn, checkfirst=True))

    async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_factory() as session:
        project_id = uuid.uuid4()
        user_id = uuid.uuid4()

        # 1. Create Report
        report = await ReportService.create_report(
            db=session,
            project_id=project_id,
            user_id=user_id,
            title="Q3 Business Performance",
            description="Quarterly executive summary",
            content_structure={
                "sections": [
                    {"title": "Overview", "text": "Q3 saw strong growth in revenue."},
                    {"title": "Financials", "text": "Gross margin reached 78%."},
                ]
            },
        )
        assert report.id is not None
        assert report.title == "Q3 Business Performance"

        # 2. Get & List Reports
        retrieved = await ReportService.get_report(session, project_id, report.id)
        assert retrieved is not None
        assert retrieved.description == "Quarterly executive summary"

        all_reports = await ReportService.list_reports(session, project_id)
        assert len(all_reports) == 1

        # 3. Update Report Structure
        updated = await ReportService.update_report(
            db=session,
            project_id=project_id,
            report_id=report.id,
            title="Q3 Executive Report",
            description="Updated quarterly summary",
        )
        assert updated.title == "Q3 Executive Report"

        # 4. Export Report Document (PDF, PPTX, XLSX)
        for fmt in ["pdf", "pptx", "xlsx"]:
            gen_file, download_url = await ReportService.export_report(
                db=session,
                project_id=project_id,
                user_id=user_id,
                report_id=report.id,
                file_format=fmt,
            )
            assert gen_file.id is not None
            assert gen_file.report_id == report.id

        # 5. Delete Report and verify ON DELETE SET NULL preservation
        deleted = await ReportService.delete_report(session, project_id, report.id)
        assert deleted is True

        gen_file_record = (await session.execute(
            GeneratedFile.__table__.select().where(GeneratedFile.id == gen_file.id)
        )).first()
        assert gen_file_record is not None
        assert gen_file_record.report_id is None  # Preserved!

    await engine.dispose()


@pytest.mark.asyncio
async def test_embedded_artifact_validation():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(lambda sync_conn: Report.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: Query.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: QueryResult.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: Chart.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: Insight.__table__.create(sync_conn, checkfirst=True))

    async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_factory() as session:
        project_id = uuid.uuid4()
        user_id = uuid.uuid4()
        fake_chart_id = uuid.uuid4()

        # Reject invalid embedded chart reference
        with pytest.raises(ValueError, match="not found"):
            await ReportService.create_report(
                db=session,
                project_id=project_id,
                user_id=user_id,
                title="Invalid Embedded Artifact",
                content_structure={"chart_ids": [str(fake_chart_id)]},
            )

    await engine.dispose()


def test_integration_contracts():
    # Module 1 Contract test
    dto = FrontendReportDocumentDTO(
        report_id="rep_123",
        title="Sample Report",
        sections=[{"title": "Intro", "text": "Hello World"}],
    )
    assert dto.report_id == "rep_123"

    # Module 2 Contract test
    safe_payload = AgentQueryExecutionPayload(
        project_id="proj_123", generated_sql="SELECT name, email FROM profiles"
    )
    res_safe = validate_agent_sql(safe_payload)
    assert res_safe.is_safe is True
    assert res_safe.is_read_only is True

    unsafe_payload = AgentQueryExecutionPayload(
        project_id="proj_123", generated_sql="DROP TABLE profiles CASCADE"
    )
    res_unsafe = validate_agent_sql(unsafe_payload)
    assert res_unsafe.is_safe is False
    assert res_unsafe.is_read_only is False
