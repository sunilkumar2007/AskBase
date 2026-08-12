import uuid
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.data_output.db.models.lineage import DataLineage
from app.modules.data_output.schemas.lineage import LineageGraphResponse, LineageNode, LineageEdge


class LineageService:
    """Service tracing source-to-result data provenance and generating graph responses."""

    @staticmethod
    async def get_project_lineage(
        db: AsyncSession, project_id: uuid.UUID
    ) -> LineageGraphResponse:
        res = await db.execute(
            select(DataLineage).where(DataLineage.project_id == project_id)
        )
        edges_db = res.scalars().all()

        nodes_dict: Dict[uuid.UUID, LineageNode] = {}
        edges: List[LineageEdge] = []

        for edge in edges_db:
            # Register source node
            if edge.source_id not in nodes_dict:
                nodes_dict[edge.source_id] = LineageNode(
                    id=edge.source_id,
                    type=edge.source_type,
                    label=f"{edge.source_type.replace('_', ' ').title()}",
                    metadata=edge.metadata_json,
                )

            # Register target node
            if edge.target_id not in nodes_dict:
                nodes_dict[edge.target_id] = LineageNode(
                    id=edge.target_id,
                    type=edge.target_type,
                    label=f"{edge.target_type.replace('_', ' ').title()}",
                    metadata={},
                )

            edges.append(
                LineageEdge(
                    id=edge.id,
                    source_type=edge.source_type,
                    source_id=edge.source_id,
                    target_type=edge.target_type,
                    target_id=edge.target_id,
                    edge_type=edge.edge_type,
                    metadata=edge.metadata_json,
                )
            )

        return LineageGraphResponse(
            project_id=project_id,
            nodes=list(nodes_dict.values()),
            edges=edges,
        )
