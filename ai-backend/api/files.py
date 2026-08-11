from fastapi import APIRouter, UploadFile, File
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
 pass

@router.get("/{file_id}")
async def get_file(file_id: str):
 pass

@router.delete("/{file_id}")
async def delete_file(file_id: str):
 pass
