import uuid
import io
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.exporters import get_exporter
from app.modules.data_output.services.file_service import FileService
from app.modules.data_output.db.models.exports import GeneratedFile
from app.modules.data_output.db.models.data import File
from app.modules.data_output.db.models.lineage import DataLineage
from app.modules.data_output.config import settings

MAX_EXPORT_ROWS = 500000


class ExportService:
    """Service orchestrating document export generation, storage persistence, and signed download URLs."""

    @staticmethod
    async def generate_export(
        db: AsyncSession,
        project_id: uuid.UUID,
        user_id: uuid.UUID,
        file_format: str,
        columns: List[str],
        rows: List[List[Any]],
        export_type: str = "dataset",
        title: str = "ASKBASE Export",
        report_id: Optional[uuid.UUID] = None,
        dashboard_id: Optional[uuid.UUID] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> Tuple[GeneratedFile, str]:
        """
        Generate export file in requested format (csv, json, xlsx, pdf, pptx),
        enforcing row limits <= 500,000.
        Uploads binary to private bucket 'askbase-exports', creates DB records in files & generated_files,
        and returns (GeneratedFile, signed_download_url).
        """
        fmt = file_format.lower().strip()
        if len(rows) > MAX_EXPORT_ROWS:
            raise ValueError(f"Export dataset size {len(rows)} exceeds maximum allowed limit of {MAX_EXPORT_ROWS} rows")

        opts = options or {}
        exporter = get_exporter(fmt)
        file_bytes = await exporter.export_query_results(
            columns=columns, rows=rows, title=title, options=opts
        )

        ext_map = {
            "csv": ("text/csv", ".csv"),
            "xlsx": ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"),
            "excel": ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"),
            "json": ("application/json", ".json"),
            "pdf": ("application/pdf", ".pdf"),
            "pptx": ("application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx"),
        }
        mime_type, ext = ext_map.get(fmt, ("application/octet-stream", f".{fmt}"))
        
        safe_title = title.lower().replace(" ", "_").replace("/", "_").replace("\\", "_")
        filename = f"{export_type}_{safe_title}_{uuid.uuid4().hex[:6]}{ext}"

        # 1. Save binary payload to askbase-exports storage bucket
        file_record = await FileService.save_uploaded_file(
            db=db,
            project_id=project_id,
            user_id=user_id,
            filename=filename,
            file_content=file_bytes,
            mime_type=mime_type,
            bucket_name=settings.STORAGE_BUCKET_EXPORTS,
        )

        # 2. Record export tracking in data_output.generated_files
        gen_file = GeneratedFile(
            project_id=project_id,
            file_id=file_record.id,
            report_id=report_id,
            dashboard_id=dashboard_id,
            export_type=fmt,
            status="completed",
        )
        db.add(gen_file)
        await db.flush()

        # Attach transient properties for response serialization
        setattr(gen_file, "file_format", fmt)
        setattr(gen_file, "file_size_bytes", len(file_bytes))
        setattr(gen_file, "options_json", opts)
        setattr(gen_file, "created_by", user_id)

        # 3. Register data lineage for exported artifact
        lineage = DataLineage(
            project_id=project_id,
            source_type="query_result" if export_type == "dataset" else export_type,
            source_id=uuid.uuid5(uuid.NAMESPACE_DNS, filename),
            target_type="generated_file",
            target_id=gen_file.id,
            edge_type="exports_to",
            metadata_json={"file_format": fmt, "filename": filename},
        )
        db.add(lineage)

        # 4. Generate signed download URL
        _, download_url = await FileService.get_download_url(db, file_record.id, expires_in_seconds=3600)

        return (gen_file, download_url)

    @staticmethod
    async def get_export_download_url(
        db: AsyncSession, export_id: uuid.UUID, expires_in_seconds: int = 3600
    ) -> Tuple[GeneratedFile, str]:
        """Retrieve generated file record and generate signed download URL."""
        res = await db.execute(select(GeneratedFile).where(GeneratedFile.id == export_id))
        gen_file = res.scalar_one_or_none()
        if not gen_file:
            raise FileNotFoundError(f"Export record {export_id} not found")

        setattr(gen_file, "file_format", gen_file.export_type)
        setattr(gen_file, "file_size_bytes", 0)
        setattr(gen_file, "options_json", {})
        setattr(gen_file, "created_by", gen_file.project_id)

        _, download_url = await FileService.get_download_url(db, gen_file.file_id, expires_in_seconds=expires_in_seconds)
        return (gen_file, download_url)
