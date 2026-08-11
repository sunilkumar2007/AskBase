import { BarChart3, Database, MessageSquare, TrendingUp } from 'lucide-react'

const stats = [
 { label: 'Total Projects', value: '12', icon: Database, change: '+2' },
 { label: 'Queries Today', value: '1,234', icon: MessageSquare, change: '+12%' },
 { label: 'Charts Generated', value: '45', icon: BarChart3, change: '+8' },
 { label: 'Avg. Response', value: '1.2s', icon: TrendingUp, change: '-0.3s' },
]

export default function HomePage() {
 return (
 <div>
 <div className="mb-6">
 <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
 <p className="text-gray-600 mt-1">Welcome to AskBase</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 {stats.map((stat) => {
 const Icon = stat.icon
 return (
 <div key={stat.label} className="bg-white rounded-lg shadow p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-gray-600">{stat.label}</p>
 <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
 </div>
 <Icon size={24} className="text-blue-500" />
 </div>
 <p className="text-sm text-green-600 mt-2">{stat.change}</p>
 </div>
 )
 })}
 </div>
 <div className="bg-white rounded-lg shadow p-6">
 <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
 <div className="space-y-4">
 {['Created new project "Sales Analytics"', 'Generated report for "Q3 Revenue"', 'Updated dashboard "Marketing KPIs"'].map((activity, i) => (
 <div key={i} className="flex items-center gap-3 text-gray-700">
 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
 <span>{activity}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
