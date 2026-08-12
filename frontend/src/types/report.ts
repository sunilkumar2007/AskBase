export interface Report {
 id: string
 project_id: string
 name: string
 format: 'pdf' | 'pptx' | 'csv' | 'xlsx'
 file_path: string
 status: 'generating' | 'completed' | 'failed'
 created_at: string
}
