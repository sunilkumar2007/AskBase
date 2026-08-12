from fastapi import FastAPI, Depends
from app.database.connection import init_pool, close_pool
from app.config import settings

app = FastAPI(title="AskBase API", version="1.0.0")

@app.on_event("startup")
async def startup():
 await init_pool()

@app.on_event("shutdown")
async def shutdown():
 await close_pool()
