import json
from typing import List, Dict, Any, Optional
from datetime import datetime, date
from uuid import UUID
from app.modules.data_output.exporters.base_exporter import BaseExporter


class JSONEncoderCustom(json.JSONEncoder):
    """Custom JSON encoder for datetimes and UUIDs."""

    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, UUID):
            return str(obj)
        return super().default(obj)


class JSONExporter(BaseExporter):
    """JSON document exporter."""

    async def export_query_results(
        self,
        columns: List[str],
        rows: List[List[Any]],
        title: str = "Query Results",
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        data_dicts = []
        for row in rows:
            record = {}
            for idx, col in enumerate(columns):
                val = row[idx] if idx < len(row) else None
                record[col] = val
            data_dicts.append(record)
            
        payload = {
            "title": title,
            "row_count": len(rows),
            "columns": columns,
            "data": data_dicts,
        }
        return json.dumps(payload, cls=JSONEncoderCustom, indent=2).encode("utf-8")

    async def export_report(
        self,
        title: str,
        content_structure: Dict[str, Any],
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        payload = {
            "title": title,
            "report_structure": content_structure,
        }
        return json.dumps(payload, cls=JSONEncoderCustom, indent=2).encode("utf-8")
