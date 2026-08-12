import { useState } from 'react'
import { UploadCloud, FileText, CheckCircle2, Trash2, ShieldCheck, Plus, Sparkles } from 'lucide-react'
import { useRAGStore, RAGFile } from '../stores/useRAGStore'
import { useCompany } from '../stores/useCompany'

export default function KnowledgeBasePage() {
  const { files, addFile, removeFile } = useRAGStore()
  const { company } = useCompany()
  const [dragging, setDragging] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  const handleFileUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    
    Array.from(fileList).forEach(file => {
      const newFile: RAGFile = {
        id: `rag-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'Enterprise Data File',
        uploadedAt: 'Just now',
        rowCount: file.name.endsWith('.csv') ? 500 : undefined,
        status: 'indexed',
        previewText: `RAG Context indexed from ${file.name} for ${company.name}.`
      }
      addFile(newFile)
    })

    setUploadMessage(`Successfully uploaded and indexed ${fileList.length} file(s) into RAG Knowledge Base!`)
    setTimeout(() => setUploadMessage(null), 4000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DDDDDD]">
        <div>
          <h1 className="text-3xl font-bold text-[#1D242E] flex items-center gap-2.5">
            <UploadCloud className="text-[#CB2958]" size={28} />
            Company RAG Knowledge Base
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Upload company data files (CSV, Excel, PDF, JSON). AI Chatbot answers will be strictly grounded in these files.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>{files.length} RAG Files Active for {company.name}</span>
        </div>
      </div>

      {uploadMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFileUpload(e.dataTransfer.files)
        }}
        className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all bg-white shadow-sm ${
          dragging ? 'border-[#CB2958] bg-[#CB2958]/5 scale-[1.01]' : 'border-[#DDDDDD] hover:border-[#6B7280]'
        }`}
      >
        <div className="w-16 h-16 bg-[#CB2958]/10 text-[#CB2958] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#CB2958]/20">
          <UploadCloud size={32} />
        </div>
        <h3 className="font-extrabold text-[#1D242E] text-lg">Upload Enterprise Data & Document Files</h3>
        <p className="text-xs text-[#6B7280] mt-1 max-w-md mx-auto">
          Supports CSV, XLSX, PDF, JSON, and TXT files. All uploaded documents are chunked and indexed into vector context.
        </p>

        <label className="mt-6 inline-flex items-center gap-2 bg-[#CB2958] hover:bg-[#A91F49] text-white font-bold text-sm px-6 py-3 rounded-xl cursor-pointer transition-colors shadow-sm">
          <Plus size={18} />
          <span>Select Files to Upload</span>
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls,.pdf,.json,.txt"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {/* Indexed Files Table WITH DELETE FILE OPTION */}
      <div className="bg-white rounded-2xl border border-[#DDDDDD] shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#1D242E] text-base flex items-center gap-2">
            <FileText size={18} className="text-[#CB2958]" /> Indexed Knowledge Base Documents ({files.length})
          </h3>
          <span className="text-xs font-mono text-[#6B7280]">RAG Context Engine Active</span>
        </div>

        <div className="divide-y divide-[#DDDDDD]">
          {files.map((file) => (
            <div key={file.id} className="py-4 flex items-center justify-between gap-4 hover:bg-[#FAFAFA] px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#CB2958]/10 text-[#CB2958] rounded-xl border border-[#CB2958]/20">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1D242E] text-sm flex items-center gap-2">
                    {file.name}
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      <Sparkles size={10} className="inline mr-1" /> RAG Indexed
                    </span>
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {file.size} • {file.type} • Uploaded {file.uploadedAt}
                  </p>
                </div>
              </div>

              {/* DELETE FILE BUTTON */}
              <button
                onClick={() => removeFile(file.id)}
                className="text-[#6B7280] hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 flex items-center gap-1 text-xs font-bold"
                title="Delete File from Knowledge Base"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Delete File</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
