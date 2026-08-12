/**
 * AskBase AI Frontend - Centralized API Service Layer
 * Connects exclusively to FastAPI backend at http://127.0.0.1:8000
 */

import {
  SystemHealth,
  DataOutputHealth,
  VoiceHealth,
  ChatRequest,
  ChatMessage,
  SchemaResponse,
  AutopilotResult,
  RootCauseResult,
  QueryExecutionResponse,
  ChartSpec,
  Dashboard,
  LineageResponse,
  ExportRequest,
  ExportResponse,
  ReportItem,
  ReportGenerateRequest,
  VoiceTranscribeResponse,
} from '../types'

export const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000'

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('askbase_token') || 'demo-dev-token'
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const token = localStorage.getItem('askbase_token') || 'demo-dev-token'

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  try {
    const response = await fetch(url, { ...options, headers })
    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { detail: errorText || `HTTP Error ${response.status}` }
      }
      throw new Error(errorData.detail || `Server returned status ${response.status}`)
    }
    return (await response.json()) as T
  } catch (err: any) {
    console.error(`API error on ${endpoint}:`, err)
    throw err
  }
}

// ── Health API ─────────────────────────────────────────────────────────────
export const healthApi = {
  getSystemHealth: () => request<SystemHealth>('/health'),
  getDataOutputHealth: () => request<DataOutputHealth>('/api/v1/data-output/health'),
  getVoiceHealth: () => request<VoiceHealth>('/api/voice/health'),
}

// ── Chat API ───────────────────────────────────────────────────────────────
export const chatApi = {
  sendMessage: (data: ChatRequest) =>
    request<ChatMessage>('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getHistory: (projectId: string = 'default') =>
    request<ChatMessage[]>(`/api/chat/history/${projectId}`),
}

// ── Agent API ──────────────────────────────────────────────────────────────
export const agentApi = {
  getSchema: (projectId: string = 'default') =>
    request<SchemaResponse>(`/api/agent/schema/${projectId}`),
  runAutopilot: (projectId: string = 'default') =>
    request<AutopilotResult>(`/api/agent/autopilot/${projectId}`, { method: 'POST' }),
  runRootCause: (projectId: string = 'default', anomaly?: string) =>
    request<RootCauseResult>(`/api/agent/root-cause/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ anomaly: anomaly || 'Revenue fluctuation' }),
    }),
}

// ── Reports API ────────────────────────────────────────────────────────────
export const reportsApi = {
  listReports: (projectId: string = 'default') =>
    request<ReportItem[]>(`/api/reports/list/${projectId}`),
  generateReport: (projectId: string = 'default', reqData: ReportGenerateRequest = {}) =>
    request<ReportItem>(`/api/reports/generate/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(reqData),
    }),
  getReport: (reportId: string) => request<ReportItem>(`/api/reports/${reportId}`),
}

// ── Data Output API (Module 3) ─────────────────────────────────────────────
export const dataOutputApi = {
  getCharts: (projectId: string = 'default') =>
    request<ChartSpec[]>(`/api/v1/data-output/projects/${projectId}/analytics/charts`),
  getDashboards: (projectId: string = 'default') =>
    request<Dashboard[]>(`/api/v1/data-output/projects/${projectId}/dashboards`),
  executeQuery: (projectId: string = 'default', sql: string) =>
    request<QueryExecutionResponse>(`/api/v1/data-output/projects/${projectId}/queries/execute`, {
      method: 'POST',
      body: JSON.stringify({ sql }),
    }),
  getLineage: (projectId: string = 'default') =>
    request<LineageResponse>(`/api/v1/data-output/projects/${projectId}/lineage`),
  generateExport: (projectId: string = 'default', expReq: ExportRequest = { format: 'csv' }) =>
    request<ExportResponse>(`/api/v1/data-output/projects/${projectId}/exports/generate`, {
      method: 'POST',
      body: JSON.stringify(expReq),
    }),
}

// ── Voice Subsystem API ────────────────────────────────────────────────────
export const voiceApi = {
  getHealth: () => request<VoiceHealth>('/api/voice/health'),
  transcribe: async (audioBlob: Blob, projectId: string = 'default'): Promise<VoiceTranscribeResponse> => {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.wav')
    formData.append('project_id', projectId)

    const url = `${API_BASE_URL}/api/voice/transcribe`
    const token = localStorage.getItem('askbase_token') || 'demo-dev-token'
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    })
    if (!response.ok) {
      throw new Error(`Voice transcription failed with HTTP ${response.status}`)
    }
    return (await response.json()) as VoiceTranscribeResponse
  },
  cancel: () =>
    request<{ status: string }>('/api/voice/cancel', { method: 'POST' }),
}
