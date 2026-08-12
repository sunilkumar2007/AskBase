/**
 * AskBase AI Frontend - TypeScript Data Contracts & Schemas
 * Strictly matches FastAPI backend OpenAPI response models.
 */

// ── Health & Diagnostics ──────────────────────────────────────────────────
export interface SystemHealth {
  status: string
  environment: string
  timestamp?: string
}

export interface DataOutputHealth {
  status: string
  module: string
  version: string
}

export interface VoiceHealth {
  status: string
  stt_provider: string
  tts_enabled: boolean
  features: {
    number_normalization: boolean
    filler_removal: boolean
    command_detection: boolean
    cancellation: boolean
    confirmation: boolean
  }
}

// ── Chat & AI Assistant ───────────────────────────────────────────────────
export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  sql?: string
  data?: QueryResultData
  chart?: ChartSpec
  explanation?: DataExplanation
  error?: string
  elapsed_ms?: number
  timestamp?: string
}

export interface ChatRequest {
  message: string
  project_id?: string
  session_id?: string
}

export interface DataExplanation {
  summary: string
  key_insights?: string[]
  trend_analysis?: string
}

// ── Schema & Agent Inspection ──────────────────────────────────────────────
export interface SchemaColumn {
  name: string
  type: string
  nullable: boolean
}

export interface ForeignKey {
  column: string
  foreign_table: string
  foreign_column: string
}

export interface SchemaTable {
  name: string
  columns: SchemaColumn[]
  primary_keys?: string[]
  foreign_keys?: ForeignKey[]
  row_count?: number
}

export interface SchemaResponse {
  project_id: string
  tables: SchemaTable[]
}

export interface AutopilotResult {
  project_id: string
  insights: string[]
  recommended_queries: string[]
  anomaly_alerts?: string[]
}

export interface RootCauseResult {
  project_id: string
  anomaly: string
  root_cause: string
  contributing_factors: string[]
  suggested_action: string
}

// ── Data & Output (Module 3) ───────────────────────────────────────────────
export interface QueryResultData {
  columns: string[]
  rows: any[][]
  row_count: number
  truncated?: boolean
}

export interface QueryExecutionRequest {
  sql: string
  project_id?: string
  max_rows?: number
}

export interface QueryExecutionResponse {
  success: boolean
  sql: string
  data?: QueryResultData
  error?: string
  elapsed_ms?: number
}

export interface ChartSpec {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter'
  title: string
  x_axis?: string
  y_axis?: string
  x_data?: string[]
  series?: Array<{
    name: string
    data: number[]
  }>
  options?: Record<string, any>
}

export interface LineageNode {
  id: string
  label: string
  type: 'source' | 'transform' | 'destination'
}

export interface LineageEdge {
  source: string
  target: string
  label?: string
}

export interface LineageResponse {
  project_id: string
  nodes: LineageNode[]
  edges: LineageEdge[]
}

export interface DashboardWidget {
  id: string
  title: string
  type: 'kpi' | 'bar' | 'line' | 'table'
  metric?: string
  sql?: string
  data?: any
}

export interface Dashboard {
  id: string
  title: string
  widgets: DashboardWidget[]
}

export interface ExportRequest {
  format: 'csv' | 'json' | 'pdf' | 'excel'
  query_id?: string
  data?: QueryResultData
}

export interface ExportResponse {
  export_id: string
  filename: string
  download_url: string
}

// ── Reports ────────────────────────────────────────────────────────────────
export interface ReportItem {
  id: string
  project_id: string
  title: string
  format: 'PDF' | 'Markdown' | 'PPTX'
  status: 'completed' | 'generating' | 'failed'
  created_at: string
  summary?: string
  download_url?: string
}

export interface ReportGenerateRequest {
  question?: string
  data_summary?: string
  topic?: string
  format?: 'PDF' | 'Markdown' | 'PPTX'
  insights?: string[]
}

// ── Voice Subsystem ────────────────────────────────────────────────────────
export interface VoiceTranscribeResponse {
  text: string
  confidence?: number
  is_command?: boolean
  command?: string
  normalized_text?: string
}

// ── Common API Error ───────────────────────────────────────────────────────
export interface ApiError {
  detail: string
  status_code?: number
}