from fastapi import APIRouter
from app.modules.data_output.api.v1.router import v1_router

router = APIRouter(prefix="/api/v1/data-output")

# Include version 1 API endpoints
router.include_router(v1_router)


@router.get("/health", tags=["Module 3 Health"])
async def health_check():
    """Module 3 Health Check Endpoint."""
    return {
        "status": "healthy",
        "module": "Module 3 - Data & Output",
        "version": "1.0.0",
    }
