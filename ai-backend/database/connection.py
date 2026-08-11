import asyncpg
import os

_pool: asyncpg.Pool | None = None

async def init_pool():
 global _pool
 _pool = await asyncpg.create_pool(os.getenv("DATABASE_URL"))

async def get_pool():
 return _pool

async def close_pool():
 if _pool:
 await _pool.close()
