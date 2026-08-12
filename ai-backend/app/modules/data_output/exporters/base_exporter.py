from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class BaseExporter(ABC):
    """Abstract Base Class for document exporters."""

    @abstractmethod
    async def export_query_results(
        self,
        columns: List[str],
        rows: List[List[Any]],
        title: str = "Query Results",
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        """Export tabular query result data into file byte stream."""
        pass

    @abstractmethod
    async def export_report(
        self,
        title: str,
        content_structure: Dict[str, Any],
        options: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        """Export structured report into file byte stream."""
        pass
