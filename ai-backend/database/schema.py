from app.database.connection import get_pool

class DatabaseQueries:
 @staticmethod
 async def get_tables():
 pass

 @staticmethod
 async def get_table_schema(table_name: str):
 pass

 @staticmethod
 async def execute_query(query: str, params: list = None):
 pass
