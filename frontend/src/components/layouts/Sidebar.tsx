import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  FolderOpen,
  FileText,
  Settings,
  Database,
  Mic,
  UploadCloud,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { path: '/home', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chat', label: 'AI RAG Chat', icon: MessageSquare },
  { path: '/knowledge', label: 'Knowledge Base', icon: UploadCloud },
  { path: '/schema', label: 'Schema Inspector', icon: Database },
  { path: '/charts', label: 'Analytics & SQL', icon: BarChart3 },
  { path: '/dashboards', label: 'Dashboards', icon: LayoutDashboard },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/voice', label: 'Voice AI Agent', icon: Mic },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/settings', label: 'System Health', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-[#1D242E] text-white flex flex-col h-screen sticky top-0 shadow-xl select-none border-r border-[#2A3340]">
      {/* Clean Typography Brand Header */}
      <div className="p-5 border-b border-[#2A3340] bg-[#161B22]/60 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <Database size={22} className="text-[#CB2958]" />
          <span className="text-2xl font-black text-[#CB2958] tracking-tight">Ask</span>
          <span className="text-2xl font-black text-white tracking-tight">Base</span>
        </div>
        <p className="text-[10px] font-black text-[#CB2958] tracking-widest uppercase mt-1">
          ASK YOUR DATABASE.
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-[#CB2958] text-white shadow-md shadow-[#CB2958]/30 font-extrabold'
                  : 'text-gray-300 hover:bg-[#2A3340] hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Connection Banner */}
      <div className="p-4 border-t border-[#2A3340] bg-[#161B22]">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>FastAPI Engine Online</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 font-mono">http://127.0.0.1:8000</p>
      </div>
    </aside>
  )
}
