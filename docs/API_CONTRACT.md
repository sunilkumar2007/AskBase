# API Contract

## Base URL
\`\`\`
http://localhost:3001/api
\`\`\`

## Endpoints

### Chat
- \`POST /chat/message\` - Send a chat message
- \`GET /chat/history/{session_id}\` - Get chat history
- \`WS /chat/ws/{session_id}\` - WebSocket for real-time chat

### Agent
- \`POST /agent/process\` - Process a request through the AI agent
- \`GET /agent/status/{session_id}\` - Get agent status

### Projects
- \`GET /projects\` - List all projects
- \`POST /projects\` - Create a project
- \`GET /projects/{id}\` - Get a project
- \`PUT /projects/{id}\` - Update a project
- \`DELETE /projects/{id}\` - Delete a project

### Reports
- \`POST /reports/generate/{project_id}\` - Generate a report
- \`GET /reports/{report_id}\` - Get a report
- \`GET /reports/list/{project_id}\` - List reports for a project

### Dashboards
- \`POST /dashboards\` - Create a dashboard
- \`GET /dashboards/{id}\` - Get a dashboard
- \`PUT /dashboards/{id}\` - Update a dashboard
- \`DELETE /dashboards/{id}\` - Delete a dashboard

### Files
- \`POST /files/upload\` - Upload a file
- \`GET /files/{file_id}\` - Get a file
- \`DELETE /files/{file_id}\` - Delete a file
