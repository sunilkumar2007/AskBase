from app.database.connection import get_pool
from app.database.schema import DatabaseQueries

class QueryExecutor:
 @staticmethod
 async def execute(query: str, params: list = None) -> dict:
 pass

 @staticmethod
 async def execute_many(query: str, params_list: list) -> dict:
 pass
