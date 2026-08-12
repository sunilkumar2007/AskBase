from typing import Dict, Type
from app.modules.data_output.exporters.base_exporter import BaseExporter
from app.modules.data_output.exporters.csv_exporter import CSVExporter
from app.modules.data_output.exporters.excel_exporter import ExcelExporter
from app.modules.data_output.exporters.json_exporter import JSONExporter
from app.modules.data_output.exporters.pdf_exporter import PDFExporter
from app.modules.data_output.exporters.pptx_exporter import PPTXExporter

EXPORTER_MAP: Dict[str, Type[BaseExporter]] = {
    "csv": CSVExporter,
    "xlsx": ExcelExporter,
    "excel": ExcelExporter,
    "json": JSONExporter,
    "pdf": PDFExporter,
    "pptx": PPTXExporter,
}


def get_exporter(export_type: str) -> BaseExporter:
    """Factory function resolving exporter instance by format type string."""
    fmt = export_type.lower()
    if fmt not in EXPORTER_MAP:
        raise ValueError(f"Unsupported export format: {export_type}")
    return EXPORTER_MAP[fmt]()


__all__ = [
    "BaseExporter",
    "CSVExporter",
    "ExcelExporter",
    "JSONExporter",
    "PDFExporter",
    "PPTXExporter",
    "get_exporter",
]
