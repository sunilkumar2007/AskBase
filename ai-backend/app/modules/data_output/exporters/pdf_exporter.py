import io
from typing import List, Dict, Any, Optional
from app.modules.data_output.exporters.base_exporter import BaseExporter

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
except ImportError:
    letter = None


class PDFExporter(BaseExporter):
    """PDF Document Exporter utilizing ReportLab."""

    async def export_query_results(
        self,
        columns: List[str],
        rows: List[List[Any]],
        title: str = "Query Results",
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        if letter is not None:
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            elements = []
            
            styles = getSampleStyleSheet()
            title_style = styles["Title"]
            
            elements.append(Paragraph(title, title_style))
            elements.append(Spacer(1, 12))
            
            # Limit rows for PDF rendering preview
            max_pdf_rows = options.get("max_rows", 100) if options else 100
            display_rows = rows[:max_pdf_rows]
            
            table_data = [columns]
            for row in display_rows:
                table_data.append([str(item) if item is not None else "" for item in row])
                
            t = Table(table_data)
            t.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e293b")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, 0), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ]
                )
            )
            elements.append(t)
            doc.build(elements)
            return buffer.getvalue()
        
        # Fallback simple PDF binary string construction if reportlab is not installed
        pdf_content = f"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj 4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj 5 0 obj<</Length 100>>stream\nBT /F1 16 Tf 50 750 Td ({title}) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\n0000000215 00000 n\n0000000278 00000 n\ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n428\n%%EOF\n"
        return pdf_content.encode("latin1")

    async def export_report(
        self,
        title: str,
        content_structure: Dict[str, Any],
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        if letter is not None:
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            elements = []
            
            styles = getSampleStyleSheet()
            elements.append(Paragraph(title, styles["Title"]))
            elements.append(Spacer(1, 14))
            
            sections = content_structure.get("sections", [])
            for sec in sections:
                elements.append(Paragraph(sec.get("title", "Section"), styles["Heading2"]))
                elements.append(Spacer(1, 6))
                elements.append(Paragraph(sec.get("content", ""), styles["Normal"]))
                elements.append(Spacer(1, 12))
                
            doc.build(elements)
            return buffer.getvalue()
            
        return await self.export_query_results(columns=["Report Title"], rows=[[title]], title=title)
