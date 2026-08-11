from fastapi import APIRouter, HTTPException, Depends
from app.security.sql_validator import validate_sql

router = APIRouter()

@router.post("/validate-sql")
async def validate_sql_endpoint(request: dict):
 pass
