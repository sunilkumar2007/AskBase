# Architecture Documentation

## System Overview

AskBase is a three-module architecture for natural language data analytics.

## Modules

### Module 1 - Frontend (`frontend/`)
React + TypeScript SPA built with Vite and TailwindCSS.

### Module 2 - AI Backend (`ai-backend/`)
FastAPI-based backend with AI agent processing, SQL generation, and tool orchestration.

### Module 3 - Data & Output (`data-output/`)
Database management, report generation (PDF/PPT), exports (CSV/JSON/Excel), and dashboard management.

## Data Flow

1. User submits natural language query via Frontend
2. Frontend sends request to AI Backend (REST/SSE)
3. AI Backend processes with AI tools and SQL logic
4. Data & Output module retrieves/saves data
5. Response (data/charts/reports) returned to UI
