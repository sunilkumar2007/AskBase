import csv
import io
import json
from typing import List, Dict, Any, Optional
from app.modules.data_output.exporters.base_exporter import BaseExporter


class CSVExporter(BaseExporter):
    """CSV document exporter."""

    async def export_query_results(
        self,
        columns: List[str],
        rows: List[List[Any]],
        title: str = "Query Results",
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header row
        writer.writerow(columns)
        
        # Data rows
        for row in rows:
            formatted_row = []
            for item in row:
                if isinstance(item, (dict, list)):
                    formatted_row.append(json.dumps(item))
                else:
                    formatted_row.append(str(item) if item is not None else "")
            writer.writerow(formatted_row)
            
        return output.getvalue().encode("utf-8")

    async def export_report(
        self,
        title: str,
        content_structure: Dict[str, Any],
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Report Title", title])
        writer.writerow([])
        
        sections = content_structure.get("sections", [])
        for section in sections:
            sec_title = section.get("title", "Section")
            writer.writerow(["Section", sec_title])
            content = section.get("content", "")
            writer.writerow(["Content", content])
            writer.writerow([])
            
        return output.getvalue().encode("utf-8")
