import { Grid, Plus } from 'lucide-react'

const widgets = [
 { id: 1, type: 'line-chart', title: 'Revenue Over Time', x: 0, y: 0, w: 6, h: 4 },
 { id: 2, type: 'bar-chart', title: 'Sales by Region', x: 6, y: 0, w: 6, h: 4 },
 { id: 3, type: 'kpi', title: 'Total Revenue', x: 0, y: 4, w: 4, h: 2 },
 { id: 4, type: 'kpi', title: 'Total Orders', x: 4, y: 4, w: 4, h: 2 },
]

export default function DashboardsPage() {
 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">Dashboards</h1>
 <p className="text-gray-600 mt-1">Build and manage dashboards</p>
 </div>
 <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
 <Plus size={20} />
 <span>New Dashboard</span>
 </button>
 </div>
 <div className="grid grid-cols-12 gap-4">
 {widgets.map((widget) => (
 <div key={widget.id} className="col-span-12 md:col-span-6 lg:col-span-6 bg-white rounded-lg shadow p-4" style={{ gridColumn: `span ${widget.w}` }}>
 <h3 className="font-semibold text-gray-900 mb-4">{widget.title}</h3>
 <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
 [{widget.type} placeholder]
 </div>
 </div>
 ))}
 </div>
 </div>
 )
}
