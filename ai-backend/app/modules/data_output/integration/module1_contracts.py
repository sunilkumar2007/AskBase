"""
Module 1 (Frontend) Integration Contract Specifications.

This module defines standard Data Transfer Objects (DTOs) and chart specification schemas
that Module 1 can consume directly. Module 3 produces pure JSON specifications for charts;
rendering (ECharts/Mermaid/Chart.js) is 100% owned by Module 1.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class FrontendChartSpecDTO(BaseModel):
    """Chart specification DTO formatted for frontend consumption (e.g. ECharts/Chart.js)."""

    chart_type: str = Field(..., description="Target rendering chart type (bar, line, pie, scatter)")
    title: str = Field(..., description="Chart display title")
    dimensions: List[str] = Field(default_factory=list, description="Categorical axis column names")
    metrics: List[str] = Field(default_factory=list, description="Numerical metric column names")
    option_spec: Dict[str, Any] = Field(
        default_factory=dict, description="Raw option payload passed to frontend chart engine"
    )


class FrontendDashboardLayoutDTO(BaseModel):
    """Responsive grid layout contract for frontend dashboard engine."""

    dashboard_id: str
    title: str
    layout_grid: List[Dict[str, Any]] = Field(
        default_factory=list, description="Grid items containing {i, x, y, w, h, widget_id}"
    )


class FrontendReportDocumentDTO(BaseModel):
    """Structured report contract for frontend document viewer engine."""

    report_id: str
    title: str
    description: Optional[str] = None
    sections: List[Dict[str, Any]] = Field(
        default_factory=list, description="List of report sections containing titles, text, chart_ids, insight_ids"
    )
