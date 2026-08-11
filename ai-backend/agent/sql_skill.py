from app.agent.base_skill import BaseSkill
from app.tools.get_schema import get_schema
from app.tools.execute_query import execute_query

class SQLSkill(BaseSkill):
 async def execute(self, params: dict) -> dict:
 pass
