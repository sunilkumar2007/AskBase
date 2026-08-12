"""AskBase AI Backend - generate_diagram tool.

Returns structured Mermaid.js diagram specifications for schema visualization.
The frontend renders Mermaid — this tool only produces the Mermaid source.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger("askbase")


def generate_diagram(data: dict[str, Any], diagram_type: str = "er") -> dict[str, Any]:
    """Produce a Mermaid.js ER diagram from schema data.

    Args:
        data: Schema dict with keys: tables (each with name, columns, primary_keys, foreign_keys).
        diagram_type: Always "er" for now — future: "flow", "sequence".

    Returns:
        {
            "type": "er",
            "mermaid": "erDiagram\n CUSTOMER ||--o{ ORDER : places\n...",
            "tables": [...],
            "relationships": [...]
        }
    """
    tables = data.get("tables", [])

    if not tables:
        return {"type": "er", "mermaid": "erDiagram\n %% No tables available", "tables": [], "relationships": []}

    lines = ["erDiagram"]

    relationships = []
    for table in tables:
        tname = table["name"].upper()
        for col in table.get("columns", []):
            cname = col["name"].upper()
            nullable = "" if col.get("nullable") else " NOT NULL"
            col_type = col.get("type", "UNKNOWN").upper()
            lines.append(f" {tname} {{")
            lines.append(f" {col_type} {cname}{nullable}")
            lines.append(" }")

        for fk in table.get("foreign_keys", []):
            ref_table = fk["references_table"].upper()
            relationships.append({
                "from_table": table["name"],
                "from_column": fk["column"],
                "to_table": fk["references_table"],
                "to_column": fk["references_column"],
            })

    # Deduplicate relationships
    seen = set()
    for rel in relationships:
        key = (rel["from_table"], rel["from_column"], rel["to_table"], rel["to_column"])
        if key not in seen:
            seen.add(key)
            card = "||--o{"
            lines.append(f" {rel['from_table'].upper()} {card} {rel['to_table'].upper()} : has")

    mermaid = "\n".join(lines)
    return {
        "type": "er",
        "mermaid": mermaid,
        "tables": [t["name"] for t in tables],
        "relationships": [{"from": r["from_table"], "to": r["to_table"], "via": r["from_column"]} for r in relationships],
    }
