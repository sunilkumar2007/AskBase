import { FolderPlus, Search, MoreVertical } from 'lucide-react'

const projects = [
 { id: 1, name: 'Sales Analytics', description: 'Analyze sales data and trends', updated: '2 hours ago', queries: 234 },
 { id: 2, name: 'Marketing KPIs', description: 'Track marketing performance metrics', updated: '1 day ago', queries: 156 },
 { id: 3, name: 'Customer Insights', description: 'Customer behavior analysis', updated: '3 days ago', queries: 89 },
]

export default function ProjectsPage() {
 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
 <p className="text-gray-600 mt-1">Manage your data projects</p>
 </div>
 <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
 <FolderPlus size={20} />
 <span>New Project</span>
 </button>
 </div>
 <div className="bg-white rounded-lg shadow">
 <div className="p-4 border-b border-gray-200">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
 <input
 type="text"
 placeholder="Search projects..."
 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 </div>
 </div>
 <div className="divide-y divide-gray-200">
 {projects.map((project) => (
 <div key={project.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
 <div>
 <h3 className="font-semibold text-gray-900">{project.name}</h3>
 <p className="text-sm text-gray-600 mt-1">{project.description}</p>
 <p className="text-xs text-gray-500 mt-1">Updated {project.updated} • {project.queries} queries</p>
 </div>
 <button className="p-2 hover:bg-gray-200 rounded-lg">
 <MoreVertical size={20} />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
