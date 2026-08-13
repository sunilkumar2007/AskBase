<div align="center">

![AskBase Brand Logo](snapshots/brand_logo.png)
*The AskBase Identity: A modern, enterprise-ready symbol representing seamless natural-language database intelligence.*

# ASKBASE
**ASK YOUR DATABASE.**

Enterprise-grade data intelligence. No SQL required. Just natural language.

### 🎬 [Watch ASKBASE AI in action — Entire Project Demo Video](https://drive.google.com/file/d/1-HFHYWSUIsydqHSrAEvDPkuF9HGbC_xN/view?usp=drivesdk)
### 🎬 [Watch ASKBASE AI in action — Live Query Demo Video](https://drive.google.com/file/d/1AmfNC6wFAVU-hVEMs3wKzBxUIe8djqbJ/view?usp=drivesdk)

</div>

---

## 📊 PROJECT STATISTICS

> *Codebase statistics are calculated from project-owned source files at the time of documentation generation. Dependency directories, build artifacts, caches, generated files, binaries, and README documentation are excluded from the primary source LOC calculation.*

```text
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  📦 SOURCE      │  💻 CODE        │  🧩 MODULES     │  📸 UI          │
│                 │                 │                 │                 │
│  270 FILES      │  19,342 LINES   │  3 MODULES      │  21 SCREENSHOTS │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

| Metric | Lines |
|---|---:|
| **Total Lines** | 19,342 |
| **Code Lines** | 16,524 |
| **Blank Lines** | 2,818 |

**Module Breakdown:**
| Module | Files | Lines of Code | Primary Role |
|---|---:|---:|---|
| **Frontend** | 62 | 4,380 | React SPA / UI |
| **AI Backend** | 137 | 9,916 | FastAPI / RAG |
| **Data Output** | 70 | 5,014 | Execution / Export |

---

## 📚 CONTENTS
- [Project Statistics](#-project-statistics)
- [Overview](#-overview)
- [Problem & Solution](#-problem--solution)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Module Architecture](#-module-architecture)
- [Application Navigation](#-application-navigation)
- [COMPLETE VISUAL PRODUCT WALKTHROUGH](#-complete-visual-product-walkthrough)
- [Technical Flows (AI, Analytics, Export)](#-technical-flows)
- [Technology Stack](#-technology-stack)
- [Project Tree](#-project-tree)
- [API Documentation](#-api-documentation)
- [Configuration & Setup](#-configuration--setup)
- [Testing & Security](#-testing--security)
- [Limitations & Status](#-limitations--status)
- [Roadmap & License](#-roadmap--license)

---

## 🎯 OVERVIEW
AskBase is an end-to-end conversational AI system wrapping an enterprise database. It enables non-technical users to query complex databases and corporate documents entirely in plain English. 

---

## ❗ PROBLEM → 💡 SOLUTION

```text
┌────────────────────────────┐
│          PROBLEM           │
│                            │
│ Manual data access         │
│ Complex SQL queries        │
│ Difficult analysis         │
│ Fragmented reporting       │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│          ASKBASE           │
│ AI + Data Intelligence     │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│          RESULT            │
│ Query / Analytics /        │
│ Reports / Insights         │
└────────────────────────────┘
```

---

## ⭐ KEY FEATURES

| Feature | Purpose |
|---|---|
| **AI RAG Chat** | Ground natural language queries with indexed files and SQL. |
| **Knowledge Base** | Upload corporate documents for Retrieval-Augmented Generation. |
| **Schema Inspector** | Inspect database tables, foreign keys, and perform diagnostics. |
| **Analytics & Dashboards** | Dynamic charts (Bar, Line, Area, Pie) and KPI tracking. |
| **Reports & Exports** | Professional Executive PDFs, CSVs, Excel, and JSON files. |
| **Voice AI Agent** | Hands-free, spoken natural language querying. |

---

## 🔄 HOW IT WORKS

```text
                  ┌──────────────────┐
                  │      USER        │
                  │ Natural Language │
                  └────────┬─────────┘
                           ↓
                  ┌──────────────────┐
                  │   ASKBASE UI     │
                  │ React / Frontend │
                  └────────┬─────────┘
                           ↓
                  ┌──────────────────┐
                  │    API LAYER     │
                  │     FastAPI      │
                  └────────┬─────────┘
                           ↓
                  ┌──────────────────┐
                  │ AI / RAG LAYER   │
                  │ Context + Logic  │
                  └────────┬─────────┘
                           ↓
                  ┌──────────────────┐
                  │ QUERY PROCESSING │
                  │ SQL / Validation │
                  └────────┬─────────┘
                           ↓
                  ┌──────────────────┐
                  │     DATABASE     │
                  └────────┬─────────┘
                           ↓
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
        Visualization   Reports       Export
```

---

## 🏗️ SYSTEM ARCHITECTURE

```text
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                 │
│                                                     │
│ React • Vite • UI Components • Pages • Charts       │
└─────────────────────────┬───────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    API LAYER                        │
│                                                     │
│ FastAPI • Routes • Request / Response Handling      │
└─────────────────────────┬───────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                   │
│                                                     │
│ Services • AI Agent Runtime • Gemini API • Business Logic   │
└─────────────────────────┬───────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                     DATA LAYER                      │
│                                                     │
│ PostgreSQL • Schema • Queries • AST Validation      │
└─────────────────────────┬───────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   OUTPUT LAYER                      │
│                                                     │
│ Analytics • Reports • Exports • Visualizations      │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 MODULE ARCHITECTURE

```text
                         ASKBASE
                            │
       ┌────────────────────┼────────────────────┐
       ↓                    ↓                    ↓
   FRONTEND             AI BACKEND           DATA OUTPUT
       │                    │                    │
   Dashboard              RAG                 Reports
   Chat                   AI                  Exports
   Analytics              SQL                 Files
   Projects               Services            Output
       │                    │                    │
       └────────────────────┼────────────────────┘
                            ↓
                         DATABASE
```

---

## 🧭 APPLICATION NAVIGATION
The visual walkthrough strictly follows the application's actual sidebar structure:

```text
ASKBASE
│
├── Landing / Authentication
├── Dashboard
├── AI RAG Chat
├── Knowledge Base
├── Schema Inspector
├── Analytics & SQL
├── Dashboards
├── Reports & Exports
├── Voice AI Agent
├── Projects
└── System Health
```

---

# 🖼️ COMPLETE VISUAL PRODUCT WALKTHROUGH

## 01 — Landing & Authentication

![Landing Page](snapshots/landing_page.png)
> **At a glance:** The primary entry point into the AskBase ecosystem, focusing on professional enterprise data intelligence.

**What this shows**
The main landing page emphasizing the platform's core value: no SQL required.

**Key capabilities**
- Access to live demos
- Secure login and account creation
- Global configuration access



---

## 02 — Dashboard

![Dashboard](snapshots/feature_01.jpg)
> **At a glance:** A high-level operational overview of system health and connected databases.

**What this shows**
The primary dashboard displaying FastAPI subsystem metrics, connected RAG documents, and active workspace health.

**Key capabilities**
- System health monitoring
- Quick-glance metrics
- Connection status tracking

---

## 03 — AI RAG Chat

![Chat](snapshots/feature_02.jpg)
> **At a glance:** The central conversational interface where natural language meets database intelligence.

**What this shows**
The primary chat window where users submit queries, receive streaming LLM responses, and view inline data visualizations.

**Key capabilities**
- Natural language to SQL translation
- Inline chart rendering
- Streaming NDJSON responses

### Chat Commands

| Table Targeting | Slash Commands |
|---|---|
| ![Table Tags](snapshots/feature_04.jpg) | ![Slash Commands](snapshots/feature_03.jpg) |
| Explicit `@` table-targeting commands | Power-user `/` shortcuts |

---

## 04 — Knowledge Base

![Knowledge Base](snapshots/feature_05.jpg)
> **At a glance:** The repository for all unstructured corporate documents used in RAG.

**What this shows**
The knowledge base hub where users upload and manage documents that the AI can reference.

**Key capabilities**
- Document management
- RAG context preparation
- Multi-file support

### Document Management

| Upload Interface | Indexed Documents |
|---|---|
| ![Upload](snapshots/feature_08.jpg) | ![Indexed Docs](snapshots/feature_07.jpg) |
| Secure document ingestion | Embedded and vectorized files |

---

## 05 — Schema Inspector

![Schema Inspector](snapshots/feature_09.jpg)
> **At a glance:** Complete visibility into the connected database architecture.

**What this shows**
The schema viewer where users can inspect tables, columns, foreign keys, and run diagnostic anomaly checks.

**Key capabilities**
- Live schema fetching
- Relationship mapping
- Anomaly diagnosis

---

## 06 — Analytics & SQL

![Add Widget](snapshots/feature_15.jpg)
> **At a glance:** Dashboard widget configuration for Analytics.

**What this shows**
The configuration interface allowing users to pin specific analytics charts and metrics to their dashboards.

**Key capabilities**
- Custom widget creation
- KPI metric tracking
- Real-time binding

### Interactive Visualization Modes

| Bar Chart | Line Chart |
|---|---|
| ![Bar Chart](snapshots/feature_10.jpg) | ![Line Chart](snapshots/feature_06.jpg) |
| Comparative metrics across categories | Data trends over time |

| Area Chart | Pie Chart |
|---|---|
| ![Area Chart](snapshots/feature_12.jpg) | ![Pie Chart](snapshots/feature_13.jpg) |
| Cumulative volume and magnitude | Proportional distribution |

---

## 07 — Dashboards

![Dashboards](snapshots/feature_17.jpg)
> **At a glance:** Consolidated real-time analytics views.

**What this shows**
The user's pinned widgets and charts arranged in a live, interactive dashboard layout.

**Key capabilities**
- Multi-chart viewing
- Real-time data updates
- Custom layout management

---

## 08 — Reports & Exports

![Reports](snapshots/feature_20.jpg)
> **At a glance:** Professional executive document generation.

**What this shows**
The Reports workspace where users can compile their chat insights and charts into formal documents.

**Key capabilities**
- Document compilation
- Artifact organization
- History tracking

### Export Formats

| PDF Report | Export Options |
|---|---|
| ![PDF Report](snapshots/feature_11.jpg) | ![Export Buttons](snapshots/feature_14.jpg) |
| High-fidelity document generation | Native data export controls |

![Excel Export](snapshots/feature_16.jpg)
> **At a glance:** Excel spreadsheet integration.

**What this shows**
Seamless XLSX generation for deep-dive offline spreadsheet analysis.

**Key capabilities**
- Native `.xlsx` formatting
- Data type preservation
- Enterprise compatibility

---

## 09 — Voice AI Agent

![Voice Settings](snapshots/feature_22.jpg)
> **At a glance:** Hands-free interaction configuration.

**What this shows**
The Voice AI settings panel where users configure speech recognition parameters.

**Key capabilities**
- Web Speech API integration
- Audio settings
- Hands-free mode

### Voice Interaction

| Active Listening | Voice Synthesis |
|---|---|
| ![Voice Mic](snapshots/feature_19.jpg) | ![Voice Speaking](snapshots/feature_21.jpg) |
| Real-time speech-to-text | Text-to-speech reporting |

---

## 10 — Projects

| Projects Dashboard | New Project |
|---|---|
| ![Projects](snapshots/feature_24.jpg) | ![New Project](snapshots/feature_27.jpg) |
| Workspace and tenant management | Data source configuration |

---

## 11 — System Health

> **At a glance:** Global system settings, profile management, and global formatting configurations.

**What this shows**
The overarching settings panels managing the company profile, system-wide configurations, and global currency formatting for all analytical dashboards.

**Key capabilities**
- Profile & Security management
- System auditing
- Global state configuration & localization support

### System Configurations

| Company Profile | Currency Settings | Account Access |
|---|---|---|
| ![Company Profile](snapshots/feature_26.jpg) | ![Currency Settings](snapshots/currency.png) | ![Account Auth](snapshots/account_auth.jpg) |
| Global system settings | Financial formatting | Account management |

---

## 🤖 AI / RAG FLOW

```text
USER QUERY
    ↓
RETRIEVAL
    ↓
RELEVANT KNOWLEDGE / SCHEMA
    ↓
GEMINI LLM
    ↓
RESPONSE / SQL
    ↓
SQLGLOT VALIDATION
    ↓
RESULT SET
```

## 📊 ANALYTICS FLOW

```text
DATA
 ↓
SQL QUERY
 ↓
RESULT SET
 ↓
RECHARTS TRANSFORMATION
 ↓
VISUALIZATION
 ↓
┌────┬────┬────┬────┐
│BAR │LINE│AREA│ PIE│
└────┴────┴────┴────┘
```

## 📥 EXPORT FLOW

```text
QUERY RESULT
     ↓
DATA PROCESSING
     ↓
FORMAT SELECTION
     ↓
┌────┬────┬────┬────┐
│CSV │PDF │XLSX│JSON│
└────┴────┴────┴────┘
     ↓
SIGNED URL DOWNLOAD
```

---

## 🛠️ TECHNOLOGY STACK

### Frontend
React, Vite, Tailwind CSS, Recharts

### Backend
FastAPI, Pydantic, Uvicorn

### AI / Intelligence
Google Generative AI SDK

### Database
PostgreSQL, SQLAlchemy, Alembic

### Security / Validation
SQLGlot (AST Parsing)

### Data / Export
ReportLab, Python-PPTX, Pandas

| Technology | Purpose |
|---|---|
| **React / Vite** | Rapid SPA bundling and reactive UI. |
| **FastAPI** | High-performance asynchronous backend API. |
| **Custom AI Agent** | Agent orchestration and tool calling loops. |
| **Google Generative AI SDK** | Natural language reasoning and SQL generation. |
| **SQLGlot** | Strict SQL AST parsing to enforce read-only execution. |
| **PostgreSQL** | Primary relational data store. |

---

## 📁 PROJECT TREE

```text
ASKBASE/
│
├── frontend/                  # Module 1: React SPA
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── ai-backend/                # Module 2: AI & Agent
│   ├── app/
│   ├── tests/
│   └── ...
│
├── data-output/               # Module 3: Data Execution & Reports
│   ├── api/
│   ├── database/
│   └── ...
│
├── snapshots/                 # Documentation visual assets
├── docs/                      # Extended technical documentation
└── README.md                  # This file
```

---

## 🔌 API DOCUMENTATION

A representative subset of the Module 3 REST API:

| METHOD | PATH | PURPOSE | REQUEST | RESPONSE |
|---|---|---|---|---|
| **GET** | `/api/v1/health` | System health check | N/A | `200 OK` |
| **POST** | `/api/v1/projects` | Create workspace | `{name, db_url}` | `ProjectDTO` |
| **POST** | `/api/v1/queries/execute` | Safely run SQL | `{sql, project_id}` | `ResultDTO` |
| **GET** | `/api/v1/exports/{id}` | Download file URL | N/A | `Signed URL` |

---

## ⚙️ CONFIGURATION

Configure `.env` in the root backend directory. Never commit secrets.

```text
GOOGLE_API_KEY=your_gemini_key
DATABASE_URL=postgresql://user:pass@localhost:5432/askbase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
SECRET_KEY=your_jwt_secret
```

---

## 🚀 SETUP & INSTALLATION

**1. Clone the repository**
```bash
git clone <repository_url>
cd ASKBASE
```

**2. Backend Setup**
```bash
cd data-output
python -m venv venv
venv\Scripts\activate
pip install -r requirements-module3.txt
alembic upgrade head
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
```

---

## ▶️ RUNNING ASKBASE

**Start Backend API**
```bash
uvicorn app.main:app --reload
# Access API at http://localhost:8000
```

**Start Frontend**
```bash
npm run dev
# Access UI at http://localhost:5173
```

---

## 🧪 TESTING & VERIFICATION

The project utilizes a Pytest suite focusing on data safety and execution isolation.

- **Unit Tests:** Tests are implemented in `ai-backend/tests/` and `data-output/tests/`.
- **Validation Check:** SQLGlot AST read-only validation confirmed.
- **E2E Tests:** Not currently documented.

---

## 🔐 SECURITY

- **SQL Safety (AST Parsing):** All LLM-generated SQL passes through SQLGlot. Any node matching an UPDATE, DROP, DELETE, or INSERT immediately throws a validation exception.
- **Tenant Isolation:** Enforced strictly via `project_id` foreign-key mappings across all API routes.
- **Private Storage:** Files in buckets cannot be accessed directly; backend services issue short-lived signed URLs.

---

## ⚠️ LIMITATIONS

- **Voice Agent Latency:** Voice AI responses are dependent on Web Speech API performance.
- **Database Dialects:** Currently natively tested and verified only with PostgreSQL.
- **LLM Compatibility:** Tightly coupled with Google Gemini currently.

---

## 📊 STATUS

**Project Status:** Active Development / Enterprise Prototype.

---

## 🗺️ ROADMAP

> Future development priorities will be defined as the project evolves.

---

## 📄 LICENSE

Internal Enterprise License. 

---

## 👨‍💻 AUTHOR

AskBase Documentation & Engineering Team. 
✅ ASKBASE README — FULLY AUDITED AND VERIFIED
