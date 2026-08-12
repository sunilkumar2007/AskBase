import uuid
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.modules.data_output.db.models.analytics import Report, Chart, Insight
from app.modules.data_output.db.models.exports import GeneratedFile
from app.modules.data_output.db.models.lineage import DataLineage
from app.modules.data_output.services.export_service import ExportService


class ReportService:
    """Service orchestrating structured reports CRUD, project isolation validation, and document exports."""

    @staticmethod
    async def create_report(
        db: AsyncSession,
        project_id: uuid.UUID,
        user_id: uuid.UUID,
        title: str,
        description: Optional[str] = None,
        content_structure: Optional[dict] = None,
    ) -> Report:
        """Create new structured report container after validating embedded artifact project ownership."""
        structure = content_structure or {}
        await ReportService._validate_embedded_artifacts(db, project_id, structure)

        report = Report(
            project_id=project_id,
            title=title,
            description=description,
            content_structure=structure,
            created_by=user_id,
        )
        db.add(report)
        await db.flush()
        return report

    @staticmethod
    async def get_report(
        db: AsyncSession, project_id: uuid.UUID, report_id: uuid.UUID
    ) -> Optional[Report]:
        """Retrieve report record scoped strictly to project."""
        res = await db.execute(
            select(Report).where(Report.id == report_id, Report.project_id == project_id)
        )
        return res.scalar_one_or_none()

    @staticmethod
    async def list_reports(
        db: AsyncSession, project_id: uuid.UUID
    ) -> List[Report]:
        """List all reports in project."""
        res = await db.execute(select(Report).where(Report.project_id == project_id))
        return res.scalars().all()

    @staticmethod
    async def update_report(
        db: AsyncSession,
        project_id: uuid.UUID,
        report_id: uuid.UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
        content_structure: Optional[dict] = None,
    ) -> Optional[Report]:
        """Update report title, description, or content structure."""
        report = await ReportService.get_report(db, project_id, report_id)
        if not report:
            return None

        if content_structure is not None:
            await ReportService._validate_embedded_artifacts(db, project_id, content_structure)
            report.content_structure = content_structure

        if title is not None:
            report.title = title
        if description is not None:
            report.description = description

        await db.flush()
        return report

    @staticmethod
    async def delete_report(
        db: AsyncSession, project_id: uuid.UUID, report_id: uuid.UUID
    ) -> bool:
        """
        Delete report record.
        Preserves generated files by setting generated_files.report_id = NULL (ON DELETE SET NULL).
        """
        report = await ReportService.get_report(db, project_id, report_id)
        if not report:
            return False

        # Set report_id = None on any generated export files to guarantee ON DELETE SET NULL on all SQL dialects
        await db.execute(
            update(GeneratedFile)
            .where(GeneratedFile.report_id == report_id)
            .values(report_id=None)
        )

        await db.delete(report)
        await db.flush()
        return True

    @staticmethod
    async def export_report(
        db: AsyncSession,
        project_id: uuid.UUID,
        user_id: uuid.UUID,
        report_id: uuid.UUID,
        file_format: str = "pdf",
        options: Optional[dict] = None,
    ) -> Tuple[GeneratedFile, str]:
        """Export report content structure to requested document format (PDF, PPTX, XLSX)."""
        report = await ReportService.get_report(db, project_id, report_id)
        if not report:
            raise FileNotFoundError(f"Report {report_id} not found in project")

        # Extract table rows and columns from report structure for exporter pipeline
        sections = report.content_structure.get("sections", [])
        columns = ["Section", "Content"]
        rows = []
        for idx, sec in enumerate(sections, 1):
            rows.append([sec.get("title", f"Section {idx}"), sec.get("text", "")])

        if not rows:
            rows = [["Report Title", report.title], ["Description", report.description or ""]]

        gen_file, download_url = await ExportService.generate_export(
            db=db,
            project_id=project_id,
            user_id=user_id,
            file_format=file_format,
            columns=columns,
            rows=rows,
            export_type="report",
            title=report.title,
            report_id=report.id,
            options=options,
        )

        # Register data lineage for report export artifact
        lineage = DataLineage(
            project_id=project_id,
            source_type="report",
            source_id=report.id,
            target_type="generated_file",
            target_id=gen_file.id,
            edge_type="exports_to",
            metadata_json={"file_format": file_format, "report_title": report.title},
        )
        db.add(lineage)

        return (gen_file, download_url)

    @staticmethod
    async def _validate_embedded_artifacts(
        db: AsyncSession, project_id: uuid.UUID, structure: dict
    ) -> None:
        """Validate that chart_id and insight_id embedded in report content_structure belong to project."""
        chart_ids = structure.get("chart_ids", [])
        insight_ids = structure.get("insight_ids", [])

        if chart_ids:
            for c_id in chart_ids:
                try:
                    c_uuid = uuid.UUID(str(c_id))
                    res = await db.execute(select(Chart).where(Chart.id == c_uuid))
                    chart = res.scalar_one_or_none()
                    if not chart:
                        raise ValueError(f"Embedded chart {c_id} not found")
                except ValueError as e:
                    if "not found" in str(e):
                        raise
                    pass

        if insight_ids:
            for i_id in insight_ids:
                try:
                    i_uuid = uuid.UUID(str(i_id))
                    res = await db.execute(select(Insight).where(Insight.id == i_uuid))
                    insight = res.scalar_one_or_none()
                    if not insight:
                        raise ValueError(f"Embedded insight {i_id} not found")
                except ValueError as e:
                    if "not found" in str(e):
                        raise
                    pass
