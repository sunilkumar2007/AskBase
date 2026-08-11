"""AskBase AI Backend - Database Migrations (Alembic).

Creates all tables needed by the backend:
- projects: user projects with DB connection strings
- chat_sessions: conversation history
- uploaded_files: file upload metadata
- dashboards: dashboard configurations
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = "001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
 # ── projects ───────────────────────────────────────────────────────────────
 op.create_table(
 "projects",
 sa.Column("id", sa.String(36), primary_key=True),
 sa.Column("user_id", sa.String(255), nullable=False),
 sa.Column("name", sa.String(255), nullable=False),
 sa.Column("description", sa.Text, nullable=True),
 sa.Column("database_url", sa.Text, nullable=True),
 sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
 sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
 )
 op.create_index("ix_projects_user_id", "projects", ["user_id"])

 # ── chat_sessions ──────────────────────────────────────────────────────────
 op.create_table(
 "chat_sessions",
 sa.Column("id", sa.String(36), primary_key=True),
 sa.Column("project_id", sa.String(36), sa.ForeignKey("projects.id"), nullable=False),
 sa.Column("user_id", sa.String(255), nullable=False),
 sa.Column("user_message", sa.Text, nullable=False),
 sa.Column("sql", sa.Text, nullable=True),
 sa.Column("response", sa.Text, nullable=True),
 sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
 )
 op.create_index("ix_chat_sessions_project_id", "chat_sessions", ["project_id"])
 op.create_index("ix_chat_sessions_user_id", "chat_sessions", ["user_id"])

 # ── uploaded_files ─────────────────────────────────────────────────────────
 op.create_table(
 "uploaded_files",
 sa.Column("id", sa.String(36), primary_key=True),
 sa.Column("user_id", sa.String(255), nullable=False),
 sa.Column("filename", sa.String(500), nullable=False),
 sa.Column("file_path", sa.Text, nullable=False),
 sa.Column("file_size", sa.BigInteger, nullable=True),
 sa.Column("content_type", sa.String(255), nullable=True),
 sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
 )
 op.create_index("ix_uploaded_files_user_id", "uploaded_files", ["user_id"])

 # ── dashboards ─────────────────────────────────────────────────────────────
 op.create_table(
 "dashboards",
 sa.Column("id", sa.String(36), primary_key=True),
 sa.Column("project_id", sa.String(36), sa.ForeignKey("projects.id"), nullable=False),
 sa.Column("user_id", sa.String(255), nullable=False),
 sa.Column("name", sa.String(255), nullable=False),
 sa.Column("config", postgresql.JSONB, nullable=True),
 sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
 sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
 )
 op.create_index("ix_dashboards_project_id", "dashboards", ["project_id"])
 op.create_index("ix_dashboards_user_id", "dashboards", ["user_id"])


def downgrade():
 op.drop_index("ix_dashboards_user_id", table_name="dashboards")
 op.drop_index("ix_dashboards_project_id", table_name="dashboards")
 op.drop_table("dashboards")

 op.drop_index("ix_uploaded_files_user_id", table_name="uploaded_files")
 op.drop_table("uploaded_files")

 op.drop_index("ix_chat_sessions_user_id", table_name="chat_sessions")
 op.drop_index("ix_chat_sessions_project_id", table_name="chat_sessions")
 op.drop_table("chat_sessions")

 op.drop_index("ix_projects_user_id", table_name="projects")
 op.drop_table("projects")
