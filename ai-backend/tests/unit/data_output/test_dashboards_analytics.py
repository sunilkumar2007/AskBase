import pytest
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.modules.data_output.services.dashboard_service import DashboardService
from app.modules.data_output.services.analytics_service import AnalyticsService
from app.modules.data_output.db.models.dashboard import Dashboard, DashboardWidget
from app.modules.data_output.db.models.analytics import Chart, Insight
from app.modules.data_output.db.models.lineage import DataLineage


@pytest.mark.asyncio
async def test_dashboard_crud_and_widgets():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(lambda sync_conn: Dashboard.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: DashboardWidget.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: DataLineage.__table__.create(sync_conn, checkfirst=True))

    async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_factory() as session:
        project_id = uuid.uuid4()
        user_id = uuid.uuid4()

        # 1. Create Dashboard
        dash = await DashboardService.create_dashboard(
            db=session,
            project_id=project_id,
            user_id=user_id,
            title="Sales Overview",
            description="Q3 Sales Performance Dashboard",
            layout_config={"columns": 12, "theme": "dark"},
        )
        assert dash.id is not None
        assert dash.title == "Sales Overview"

        # 2. Add Widgets (Chart, Metric, Table, Text)
        w_metric = await DashboardService.add_widget(
            db=session,
            project_id=project_id,
            dashboard_id=dash.id,
            widget_type="metric",
            title="Total Revenue",
            config={"unit": "$", "precision": 2},
            position={"x": 0, "y": 0, "w": 3, "h": 2},
        )
        assert w_metric.id is not None
        assert w_metric.widget_type == "metric"

        w_chart = await DashboardService.add_widget(
            db=session,
            project_id=project_id,
            dashboard_id=dash.id,
            widget_type="chart",
            title="Revenue Trend",
            chart_id=uuid.uuid4(),
            config={"showLegend": True},
            position={"x": 3, "y": 0, "w": 9, "h": 4},
        )
        assert w_chart.id is not None

        # 3. Update Dashboard Layout
        updated_dash = await DashboardService.update_dashboard(
            db=session,
            project_id=project_id,
            dashboard_id=dash.id,
            title="Q3 Sales Overview",
            layout_config={"columns": 12, "theme": "light"},
        )
        assert updated_dash.title == "Q3 Sales Overview"
        assert updated_dash.layout_config["theme"] == "light"

        # 4. Remove Widget
        removed = await DashboardService.remove_widget(
            db=session, project_id=project_id, dashboard_id=dash.id, widget_id=w_metric.id
        )
        assert removed is True

        # 5. Delete Dashboard
        deleted = await DashboardService.delete_dashboard(
            db=session, project_id=project_id, dashboard_id=dash.id
        )
        assert deleted is True

    await engine.dispose()


@pytest.mark.asyncio
async def test_charts_insights_and_lineage():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(lambda sync_conn: Chart.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: Insight.__table__.create(sync_conn, checkfirst=True))
        await conn.run_sync(lambda sync_conn: DataLineage.__table__.create(sync_conn, checkfirst=True))

    async_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_factory() as session:
        query_result_id = uuid.uuid4()
        project_id = uuid.uuid4()

        # 1. Create Chart
        chart = await AnalyticsService.create_chart(
            db=session,
            query_result_id=query_result_id,
            title="Monthly Active Users",
            chart_type="bar",
            chart_spec={"x": "month", "y": "mau"},
        )
        assert chart.id is not None
        assert chart.chart_type == "bar"

        # 2. Get Chart
        retrieved_chart = await AnalyticsService.get_chart(session, chart.id)
        assert retrieved_chart.title == "Monthly Active Users"

        # 3. Create Insight
        insight = await AnalyticsService.create_insight(
            db=session,
            title="User Growth Acceleration",
            summary="Active users increased 24% month-over-month.",
            details={"growth_rate": 0.24},
            query_result_id=query_result_id,
        )
        assert insight.id is not None
        assert "24%" in insight.summary

        # 4. List Insights
        insights_list = await AnalyticsService.list_insights(session, query_result_id)
        assert len(insights_list) == 1

        # 5. Data Lineage Extraction
        lineage_edge = DataLineage(
            project_id=project_id,
            source_type="query_result",
            source_id=query_result_id,
            target_type="chart",
            target_id=chart.id,
            edge_type="renders",
            metadata_json={"chart_type": "bar"},
        )
        session.add(lineage_edge)
        await session.flush()

        edges, node_count, edge_count = await AnalyticsService.get_lineage_graph(session, project_id)
        assert edge_count == 1
        assert node_count == 2
        assert edges[0].edge_type == "renders"

    await engine.dispose()
