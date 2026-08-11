from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AskBase API", version="1.0.0")

app.add_middleware(
 CORSMiddleware,
 allow_origins=["*"],
 allow_credentials=True,
 allow_methods=["*"],
 allow_headers=["*"],
)

from app.api import chat, agent, projects, reports, dashboards, files

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(agent.router, prefix="/api/agent", tags=["agent"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(dashboards.router, prefix="/api/dashboards", tags=["dashboards"])
app.include_router(files.router, prefix="/api/files", tags=["files"])

@app.get("/health")
async def health():
 return {"status": "ok"}
