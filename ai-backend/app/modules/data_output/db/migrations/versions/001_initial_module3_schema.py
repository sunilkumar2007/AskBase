"""Initial Module 3 Schema - 17 Tables

Revision ID: 001_initial_module3_schema
Revises: 
Create Date: 2026-08-11 19:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_module3_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

SCHEMA_NAME = "data_output"


def upgrade() -> None:
    # 0. Ensure schema exists
    op.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA_NAME}")

    # 1. profiles
    op.create_table(
        'profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('email', name='uq_profiles_email'),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_profiles_email', 'profiles', ['email'], unique=True, schema=SCHEMA_NAME)

    # 2. projects
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('settings', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_projects_name', 'projects', ['name'], unique=False, schema=SCHEMA_NAME)
    op.create_index('ix_data_output_projects_created_by', 'projects', ['created_by'], unique=False, schema=SCHEMA_NAME)

    # 3. project_members
    op.create_table(
        'project_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='viewer'),
        sa.Column('joined_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('project_id', 'user_id', name='uq_project_user_member'),
        schema=SCHEMA_NAME,
    )
    op.create_index('idx_project_members_lookup', 'project_members', ['project_id', 'user_id'], unique=False, schema=SCHEMA_NAME)

    # 4. data_sources
    op.create_table(
        'data_sources',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('connection_config_encrypted', sa.Text(), nullable=True),
        sa.Column('schema_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_data_sources_project_id', 'data_sources', ['project_id'], unique=False, schema=SCHEMA_NAME)

    # 5. files
    op.create_table(
        'files',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('storage_path', sa.Text(), nullable=False),
        sa.Column('bucket_name', sa.String(length=100), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=False),
        sa.Column('file_size_bytes', sa.BigInteger(), nullable=False),
        sa.Column('checksum', sa.String(length=64), nullable=True),
        sa.Column('metadata_json', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_files_project_id', 'files', ['project_id'], unique=False, schema=SCHEMA_NAME)
    op.create_index('ix_data_output_files_checksum', 'files', ['checksum'], unique=False, schema=SCHEMA_NAME)
    op.create_index('idx_files_project_checksum', 'files', ['project_id', 'checksum'], unique=False, schema=SCHEMA_NAME)

    # 6. chats
    op.create_table(
        'chats',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False, server_default='New Conversation'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_chats_project_id', 'chats', ['project_id'], unique=False, schema=SCHEMA_NAME)

    # 7. messages
    op.create_table(
        'messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('chat_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.chats.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sender_role', sa.String(length=50), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('metadata_json', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_messages_chat_id', 'messages', ['chat_id'], unique=False, schema=SCHEMA_NAME)
    op.create_index('idx_messages_chat_seq', 'messages', ['chat_id', 'created_at'], unique=False, schema=SCHEMA_NAME)

    # 8. queries
    op.create_table(
        'queries',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('chat_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.chats.id', ondelete='SET NULL'), nullable=True),
        sa.Column('raw_sql', sa.Text(), nullable=False),
        sa.Column('compiled_sql', sa.Text(), nullable=False),
        sa.Column('dialect', sa.String(length=50), nullable=False, server_default='postgres'),
        sa.Column('is_read_only', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_queries_project_id', 'queries', ['project_id'], unique=False, schema=SCHEMA_NAME)
    op.create_index('ix_data_output_queries_chat_id', 'queries', ['chat_id'], unique=False, schema=SCHEMA_NAME)

    # 9. query_results
    op.create_table(
        'query_results',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('query_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.queries.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='completed'),
        sa.Column('row_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('execution_time_ms', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('columns_schema', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('result_cache_path', sa.Text(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_query_results_query_id', 'query_results', ['query_id'], unique=False, schema=SCHEMA_NAME)

    # 10. saved_queries
    op.create_table(
        'saved_queries',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('sql_template', sa.Text(), nullable=False),
        sa.Column('parameters_schema', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_saved_queries_project_id', 'saved_queries', ['project_id'], unique=False, schema=SCHEMA_NAME)

    # 11. charts
    op.create_table(
        'charts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('query_result_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.query_results.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('chart_type', sa.String(length=50), nullable=False),
        sa.Column('chart_spec', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_charts_query_result_id', 'charts', ['query_result_id'], unique=False, schema=SCHEMA_NAME)

    # 12. insights
    op.create_table(
        'insights',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('query_result_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.query_results.id', ondelete='CASCADE'), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('details', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_insights_query_result_id', 'insights', ['query_result_id'], unique=False, schema=SCHEMA_NAME)

    # 13. reports
    op.create_table(
        'reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('content_structure', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_reports_project_id', 'reports', ['project_id'], unique=False, schema=SCHEMA_NAME)

    # 14. dashboards
    op.create_table(
        'dashboards',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('layout_config', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_dashboards_project_id', 'dashboards', ['project_id'], unique=False, schema=SCHEMA_NAME)

    # 15. dashboard_widgets
    op.create_table(
        'dashboard_widgets',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('dashboard_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.dashboards.id', ondelete='CASCADE'), nullable=False),
        sa.Column('widget_type', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('query_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.queries.id', ondelete='SET NULL'), nullable=True),
        sa.Column('chart_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.charts.id', ondelete='SET NULL'), nullable=True),
        sa.Column('config', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('position', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_dashboard_widgets_dashboard_id', 'dashboard_widgets', ['dashboard_id'], unique=False, schema=SCHEMA_NAME)

    # 16. data_lineage
    op.create_table(
        'data_lineage',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('source_type', sa.String(length=50), nullable=False),
        sa.Column('source_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('target_type', sa.String(length=50), nullable=False),
        sa.Column('target_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('edge_type', sa.String(length=50), nullable=False, server_default='derived_from'),
        sa.Column('metadata_json', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_data_lineage_project_id', 'data_lineage', ['project_id'], unique=False, schema=SCHEMA_NAME)
    op.create_index('idx_lineage_source', 'data_lineage', ['source_type', 'source_id'], unique=False, schema=SCHEMA_NAME)
    op.create_index('idx_lineage_target', 'data_lineage', ['target_type', 'target_id'], unique=False, schema=SCHEMA_NAME)

    # 17. generated_files
    op.create_table(
        'generated_files',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('report_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.reports.id', ondelete='SET NULL'), nullable=True),
        sa.Column('dashboard_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.dashboards.id', ondelete='SET NULL'), nullable=True),
        sa.Column('export_type', sa.String(length=20), nullable=False),
        sa.Column('file_id', postgresql.UUID(as_uuid=True), sa.ForeignKey(f'{SCHEMA_NAME}.files.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='completed'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        schema=SCHEMA_NAME,
    )
    op.create_index('ix_data_output_generated_files_project_id', 'generated_files', ['project_id'], unique=False, schema=SCHEMA_NAME)
    op.create_index('ix_data_output_generated_files_report_id', 'generated_files', ['report_id'], unique=False, schema=SCHEMA_NAME)
    op.create_index('ix_data_output_generated_files_dashboard_id', 'generated_files', ['dashboard_id'], unique=False, schema=SCHEMA_NAME)


def downgrade() -> None:
    op.drop_table('generated_files', schema=SCHEMA_NAME)
    op.drop_table('data_lineage', schema=SCHEMA_NAME)
    op.drop_table('dashboard_widgets', schema=SCHEMA_NAME)
    op.drop_table('dashboards', schema=SCHEMA_NAME)
    op.drop_table('reports', schema=SCHEMA_NAME)
    op.drop_table('insights', schema=SCHEMA_NAME)
    op.drop_table('charts', schema=SCHEMA_NAME)
    op.drop_table('saved_queries', schema=SCHEMA_NAME)
    op.drop_table('query_results', schema=SCHEMA_NAME)
    op.drop_table('queries', schema=SCHEMA_NAME)
    op.drop_table('messages', schema=SCHEMA_NAME)
    op.drop_table('chats', schema=SCHEMA_NAME)
    op.drop_table('files', schema=SCHEMA_NAME)
    op.drop_table('data_sources', schema=SCHEMA_NAME)
    op.drop_table('project_members', schema=SCHEMA_NAME)
    op.drop_table('projects', schema=SCHEMA_NAME)
    op.drop_table('profiles', schema=SCHEMA_NAME)
    op.execute(f"DROP SCHEMA IF EXISTS {SCHEMA_NAME} CASCADE")
