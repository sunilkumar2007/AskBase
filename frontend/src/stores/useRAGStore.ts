import { useState } from 'react'

export interface RAGFile {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
  rowCount?: number
  status: 'indexed' | 'indexing' | 'error'
  previewText?: string
}

const DEFAULT_FILES: RAGFile[] = [
  {
    id: 'rag-1',
    name: 'acme_q3_sales_data.csv',
    size: '1.2 MB',
    type: 'CSV Data Table',
    uploadedAt: 'Today, 2:15 PM',
    rowCount: 1420,
    status: 'indexed',
    previewText: 'Product,Sales,Revenue,Region,Customer\nWidgets,14500,29000,North America,Acme Corp\nGadgets,28900,57800,Europe,Globex Inc'
  },
  {
    id: 'rag-2',
    name: 'company_kpi_targets_2026.pdf',
    size: '850 KB',
    type: 'PDF Document',
    uploadedAt: 'Yesterday',
    status: 'indexed',
    previewText: 'Target Q3 growth rate: 20% YoY. Revenue target: $200,000. Customer retention target: 95%.'
  }
]

export function useRAGStore() {
  const [files, setFilesState] = useState<RAGFile[]>(() => {
    const saved = localStorage.getItem('askbase_rag_files')
    return saved ? JSON.parse(saved) : DEFAULT_FILES
  })

  const addFile = (file: RAGFile) => {
    const updated = [file, ...files]
    setFilesState(updated)
    localStorage.setItem('askbase_rag_files', JSON.stringify(updated))
  }

  const removeFile = (id: string) => {
    const updated = files.filter(f => f.id !== id)
    setFilesState(updated)
    localStorage.setItem('askbase_rag_files', JSON.stringify(updated))
  }

  return { files, addFile, removeFile }
}
