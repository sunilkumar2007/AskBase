import { useState } from 'react'
import { FolderPlus, Search, Database, CheckCircle2, X, MessageSquare, BarChart3, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: string
  name: string
  description: string
  database_url: string
  updated: string
  queries: number
  connected: boolean
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dbUrl, setDbUrl] = useState('')

  const [projectsList, setProjectsList] = useState<Project[]>([
    {
      id: 'proj-sales',
      name: 'Sales Analytics & Revenue',
      description: 'Analyze sales data, orders, and monthly revenue trends in Rupees (₹)',
      database_url: 'sqlite+aiosqlite:///askbase.db',
      updated: 'Just now',
      queries: 234,
      connected: true,
    },
    {
      id: 'proj-marketing',
      name: 'Marketing KPIs & Campaigns',
      description: 'Track marketing performance metrics, ROI & conversion rates',
      database_url: 'postgresql+asyncpg://user:pass@localhost:5432/marketing',
      updated: '1 day ago',
      queries: 156,
      connected: true,
    },
    {
      id: 'proj-customers',
      name: 'Customer Demographics & Retention',
      description: 'Customer behavior, churn prediction & cohort analysis',
      database_url: 'sqlite+aiosqlite:///customers.db',
      updated: '3 days ago',
      queries: 89,
      connected: true,
    },
  ])

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setProjectsList(projectsList.filter(p => p.id !== id))
  }

  const handleCreateProject = () => {
    if (!name.trim()) return
    const newProj: Project = {
      id: `proj-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name,
      description: description || 'Analytics project for AskBase AI query engine.',
      database_url: dbUrl || 'sqlite+aiosqlite:///askbase.db',
      updated: 'Just now',
      queries: 0,
      connected: true,
    }
    setProjectsList([newProj, ...projectsList])
    setName('')
    setDescription('')
    setDbUrl('')
    setShowModal(false)
  }

  const filtered = projectsList.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#DDDDDD]">
        <div>
          <h1 className="text-3xl font-bold text-[#1D242E]">Projects & Data Sources</h1>
          <p className="text-[#6B7280] mt-1">Manage database connections and query environments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#CB2958] text-white px-4 py-2.5 rounded-xl hover:bg-[#A91F49] font-bold shadow-sm transition-colors"
        >
          <FolderPlus size={18} />
          <span>New Project</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#DDDDDD]">
        <div className="p-4 border-b border-[#DDDDDD]">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by name or description..."
              className="pl-10 pr-4 py-2 border border-[#DDDDDD] rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#CB2958] text-sm bg-[#FAFAFA] text-[#1D242E]"
            />
          </div>
        </div>

        <div className="divide-y divide-[#DDDDDD]">
          {filtered.map((project) => (
            <div key={project.id} className="p-6 hover:bg-[#FAFAFA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 
                    onClick={() => navigate(`/chat/${project.id}`)}
                    className="font-bold text-[#1D242E] text-lg hover:text-[#CB2958] cursor-pointer"
                  >
                    {project.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    <CheckCircle2 size={12} /> Connected
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">{project.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] font-mono pt-1">
                  <span className="flex items-center gap-1 text-[#1D242E] font-bold"><Database size={13} className="text-[#CB2958]" /> {project.database_url}</span>
                  <span>ID: {project.id}</span>
                  <span>Updated {project.updated}</span>
                  <span>{project.queries} queries</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => navigate(`/chat/${project.id}`)}
                  className="flex items-center gap-1.5 text-xs bg-[#CB2958] text-white hover:bg-[#A91F49] px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <MessageSquare size={14} />
                  <span>AI Chat</span>
                </button>
                <button
                  onClick={() => navigate(`/schema/${project.id}`)}
                  className="flex items-center gap-1.5 text-xs bg-[#EEEEEE] text-[#1D242E] hover:bg-[#DDDDDD] border border-[#DDDDDD] px-3.5 py-2 rounded-xl font-bold transition-colors"
                >
                  <Database size={14} />
                  <span>Schema</span>
                </button>
                <button
                  onClick={() => navigate(`/charts/${project.id}`)}
                  className="flex items-center gap-1.5 text-xs bg-[#EEEEEE] text-[#1D242E] hover:bg-[#DDDDDD] border border-[#DDDDDD] px-3.5 py-2 rounded-xl font-bold transition-colors"
                >
                  <BarChart3 size={14} />
                  <span>Analytics</span>
                </button>
                {/* DELETE PROJECT BUTTON */}
                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  title="Delete Project"
                  className="p-2 text-[#6B7280] hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDDDDD]">
              <h2 className="text-xl font-bold text-[#1D242E] flex items-center gap-2">
                <FolderPlus className="text-[#CB2958]" size={22} /> New Data Project
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-[#1D242E]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1D242E] uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q4 Sales Performance"
                  className="w-full px-3.5 py-2 border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-[#CB2958] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1D242E] uppercase mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What database tables are analyzed in this project?"
                  className="w-full px-3.5 py-2 border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-[#CB2958] text-sm h-20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1D242E] uppercase mb-1">Database Connection String</label>
                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  placeholder="sqlite+aiosqlite:///askbase.db"
                  className="w-full px-3.5 py-2 border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-[#CB2958] text-sm font-mono"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">Supports PostgreSQL, SQLite, MySQL, and Supabase connection strings.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[#DDDDDD]">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#1D242E] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!name.trim()}
                className="px-4 py-2 text-sm bg-[#CB2958] text-white rounded-xl hover:bg-[#A91F49] disabled:opacity-50 font-bold"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
