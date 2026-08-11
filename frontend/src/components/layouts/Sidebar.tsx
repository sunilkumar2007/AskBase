import { Link, useLocation } from 'react-router-dom'
import {
 LayoutDashboard,
 MessageSquare,
 BarChart3,
 FolderOpen,
 FileText,
 Settings,
 LogOut,
} from 'lucide-react'

const navItems = [
 { path: '/', label: 'Dashboard', icon: LayoutDashboard },
 { path: '/projects', label: 'Projects', icon: FolderOpen },
 { path: '/chat', label: 'Chat', icon: MessageSquare },
 { path: '/charts', label: 'Charts', icon: BarChart3 },
 { path: '/dashboards', label: 'Dashboards', icon: FolderOpen },
 { path: '/reports', label: 'Reports', icon: FileText },
 { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
 const location = useLocation()

 return (
 <aside className="w-64 bg-slate-900 text-white flex flex-col">
 <div className="p-4 border-b border-slate-700">
 <h1 className="text-xl font-bold">AskBase</h1>
 </div>
 <nav className="flex-1 p-4 space-y-2">
 {navItems.map((item) => {
 const Icon = item.icon
 const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
 return (
 <Link
 key={item.path}
 to={item.path}
 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
 isActive
 ? 'bg-slate-800 text-white'
 : 'text-slate-300 hover:bg-slate-800 hover:text-white'
 }`}
 >
 <Icon size={20} />
 <span>{item.label}</span>
 </Link>
 )
 })}
 </nav>
 <div className="p-4 border-t border-slate-700">
 <button className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white w-full">
 <LogOut size={20} />
 <span>Logout</span>
 </button>
 </div>
 </aside>
 )
}
