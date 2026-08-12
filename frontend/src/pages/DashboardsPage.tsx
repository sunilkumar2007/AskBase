import { useState } from 'react'
import { Plus, TrendingUp, X } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Widget {
  id: string
  title: string
  type: 'kpi' | 'bar' | 'line'
  metric: string
  data?: any[]
}

const sampleMonthlyData = [
  { name: 'Jan', value: 40000 },
  { name: 'Feb', value: 30000 },
  { name: 'Mar', value: 50000 },
  { name: 'Apr', value: 45000 },
  { name: 'May', value: 60000 },
  { name: 'Jun', value: 55000 },
]

export default function DashboardsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'w-1', title: 'Total Revenue', type: 'kpi', metric: '₹1,24,500' },
    { id: 'w-2', title: 'Total Orders', type: 'kpi', metric: '1,420' },
    { id: 'w-3', title: 'Active Customers', type: 'kpi', metric: '890' },
    { id: 'w-4', title: 'Monthly Revenue Trend', type: 'line', metric: '+12.4%', data: sampleMonthlyData },
    { id: 'w-5', title: 'Sales by Region', type: 'bar', metric: 'Top Region: India', data: [
      { name: 'India', value: 42000 },
      { name: 'EU', value: 31000 },
      { name: 'APAC', value: 24000 },
      { name: 'LATAM', value: 18000 }
    ]},
  ])

  const [showModal, setShowModal] = useState(false)
  const [widgetTitle, setWidgetTitle] = useState('')
  const [widgetType, setWidgetType] = useState<'kpi' | 'bar' | 'line'>('bar')

  const handleAddWidget = () => {
    if (!widgetTitle.trim()) return
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      title: widgetTitle,
      type: widgetType,
      metric: '₹42,000',
      data: sampleMonthlyData
    }
    setWidgets([...widgets, newWidget])
    setWidgetTitle('')
    setShowModal(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1D242E]">Dashboards</h1>
          <p className="text-[#6B7280] mt-1">Real-time analytical dashboards & KPI widgets (INR ₹)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#CB2958] text-white px-4 py-2.5 rounded-xl hover:bg-[#A91F49] font-bold shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span>Add Widget</span>
        </button>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {widgets.filter(w => w.type === 'kpi').map((widget) => (
          <div key={widget.id} className="bg-white rounded-2xl shadow-sm border border-[#DDDDDD] p-5">
            <p className="text-xs font-bold text-[#6B7280] uppercase">{widget.title}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-extrabold text-[#CB2958]">{widget.metric}</span>
              <div className="p-2 bg-[#CB2958]/10 text-[#CB2958] rounded-xl">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-semibold">↑ 8.4% vs last month</p>
          </div>
        ))}
      </div>

      {/* Chart Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {widgets.filter(w => w.type !== 'kpi').map((widget) => (
          <div key={widget.id} className="bg-white rounded-2xl shadow-sm border border-[#DDDDDD] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1D242E] text-base">{widget.title}</h3>
              <span className="text-xs font-bold text-[#CB2958] bg-[#CB2958]/10 px-2.5 py-1 rounded-lg">{widget.type.toUpperCase()}</span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {widget.type === 'line' ? (
                  <LineChart data={widget.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#CB2958" strokeWidth={2.5} />
                  </LineChart>
                ) : (
                  <BarChart data={widget.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#CB2958" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Add Widget Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDDDDD]">
              <h2 className="text-xl font-bold text-[#1D242E]">Add Dashboard Widget</h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-[#1D242E]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1D242E] uppercase mb-1">Widget Title</label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  placeholder="e.g. Quarterly Sales Comparison"
                  className="w-full px-3.5 py-2 border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-[#CB2958] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1D242E] uppercase mb-1">Widget Type</label>
                <select
                  value={widgetType}
                  onChange={(e: any) => setWidgetType(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-[#CB2958] text-sm bg-white"
                >
                  <option value="bar">Bar Chart Widget</option>
                  <option value="line">Line Chart Widget</option>
                  <option value="kpi">KPI Summary Metric Card</option>
                </select>
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
                onClick={handleAddWidget}
                disabled={!widgetTitle.trim()}
                className="px-4 py-2 text-sm bg-[#CB2958] text-white rounded-xl hover:bg-[#A91F49] disabled:opacity-50 font-bold"
              >
                Add Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
