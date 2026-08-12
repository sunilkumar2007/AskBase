import { useState } from 'react'
import {
  BarChart3,
  LineChart as LineIcon,
  PieChart as PieIcon,
  Table as TableIcon,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileText,
  Code,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useCompany } from '../stores/useCompany'

const COLORS = ['#CB2958', '#10b981', '#f59e0b', '#8b5cf6', '#1D242E', '#06b6d4']

const sampleAnalyticsData = [
  { name: 'Widgets', sales: 145000, revenue: 290000, orders: 420, growth: 18.5 },
  { name: 'Gadgets', sales: 289000, revenue: 578000, orders: 890, growth: 24.2 },
  { name: 'Services', sales: 312000, revenue: 624000, orders: 310, growth: 12.0 },
  { name: 'Components', sales: 98000, revenue: 196000, orders: 210, growth: 8.4 },
  { name: 'Accessories', sales: 184000, revenue: 368000, orders: 650, growth: 15.1 },
]

export default function ChartsPage() {
  const { company } = useCompany()
  const [activeFormat, setActiveFormat] = useState<'bar' | 'line' | 'pie' | 'area' | 'table'>('bar')
  const [data] = useState(sampleAnalyticsData)
  const [exportMessage, setExportMessage] = useState<string | null>(null)

  const handleExport = (formatType: 'CSV' | 'Excel' | 'PDF' | 'JSON') => {
    const cleanCompanyName = company.name.toLowerCase().replace(/\s+/g, '_')

    if (formatType === 'CSV') {
      const csvContent = 'Category/Product,Sales Volume (INR),Gross Revenue (INR),Total Orders,Growth Rate (%)\n' +
        data.map(d => `"${d.name}",${d.sales},${d.revenue},${d.orders},${d.growth}%`).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cleanCompanyName}_statistics.csv`
      a.click()
      URL.revokeObjectURL(url)
    } else if (formatType === 'Excel') {
      const xlsContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"></head>
<body>
  <h2>${company.name} - Enterprise Statistics Report (Rupees ₹)</h2>
  <table border="1">
    <thead>
      <tr style="background:#CB2958; color:#ffffff;">
        <th>Category / Product</th>
        <th>Sales Volume (₹)</th>
        <th>Gross Revenue (₹)</th>
        <th>Total Orders</th>
        <th>Growth Rate (%)</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(d => `<tr><td>${d.name}</td><td>₹${d.sales.toLocaleString()}</td><td>₹${d.revenue.toLocaleString()}</td><td>${d.orders}</td><td>${d.growth}%</td></tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`

      const blob = new Blob([xlsContent], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cleanCompanyName}_statistics.xls`
      a.click()
      URL.revokeObjectURL(url)
    } else if (formatType === 'PDF') {
      const pdfDocument = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${company.name} - Analytics & Statistics Document</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FAFAFA; padding: 40px; color: #1D242E; }
    .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 36px; border-radius: 16px; border: 1px solid #DDDDDD; }
    .header { border-bottom: 2px solid #CB2958; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: #1D242E; margin: 0; }
    .subtitle { font-size: 13px; color: #6B7280; margin-top: 4px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .kpi-card { background: #FAFAFA; padding: 14px; border-radius: 12px; border: 1px solid #DDDDDD; }
    .kpi-title { font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; }
    .kpi-value { font-size: 18px; font-weight: 800; color: #CB2958; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { background: #EEEEEE; padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #DDDDDD; color: #1D242E; }
    td { padding: 10px; border-bottom: 1px solid #DDDDDD; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">${company.name} - Enterprise Analytics</h1>
      <p class="subtitle">Generated on ${new Date().toLocaleDateString()} • Currency: INR (₹)</p>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-title">Total Sales</div><div class="kpi-value">₹${data.reduce((a, b) => a + b.sales, 0).toLocaleString()}</div></div>
      <div class="kpi-card"><div class="kpi-title">Total Revenue</div><div class="kpi-value">₹${data.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</div></div>
      <div class="kpi-card"><div class="kpi-title">Total Orders</div><div class="kpi-value">${data.reduce((a, b) => a + b.orders, 0).toLocaleString()}</div></div>
      <div class="kpi-card"><div class="kpi-title">Avg Growth</div><div class="kpi-value">+${(data.reduce((a, b) => a + b.growth, 0) / data.length).toFixed(1)}%</div></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Category / Product</th>
          <th>Sales Volume (₹)</th>
          <th>Gross Revenue (₹)</th>
          <th>Total Orders</th>
          <th>Growth Rate (%)</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(d => `<tr><td>${d.name}</td><td>₹${d.sales.toLocaleString()}</td><td>₹${d.revenue.toLocaleString()}</td><td>${d.orders}</td><td>+${d.growth}%</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`

      const blob = new Blob([pdfDocument], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cleanCompanyName}_analytics_report.html`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cleanCompanyName}_statistics.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    setExportMessage(`Exported statistics as ${formatType} successfully!`)
    setTimeout(() => setExportMessage(null), 3000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DDDDDD]">
        <div>
          <h1 className="text-3xl font-bold text-[#1D242E] flex items-center gap-2.5">
            <BarChart3 className="text-[#CB2958]" size={28} />
            Enterprise Analytics & Statistics (INR ₹)
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Data insights and multi-format statistics for <span className="font-bold text-[#1D242E]">{company.name}</span> in Indian Rupees (₹).
          </p>
        </div>

        {/* Export Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 text-xs bg-white text-[#1D242E] hover:bg-[#EEEEEE] border border-[#DDDDDD] px-3.5 py-2 rounded-xl font-bold shadow-sm transition-colors"
          >
            <Download size={13} className="text-[#CB2958]" /> CSV
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl font-bold shadow-sm transition-colors"
          >
            <FileSpreadsheet size={13} /> Excel
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 text-xs bg-[#CB2958]/10 text-[#CB2958] hover:bg-[#CB2958]/20 border border-[#CB2958]/30 px-3.5 py-2 rounded-xl font-bold shadow-sm transition-colors"
          >
            <FileText size={13} /> PDF Document
          </button>
          <button
            onClick={() => handleExport('JSON')}
            className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl font-bold shadow-sm transition-colors"
          >
            <Code size={13} /> JSON
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">
          {exportMessage}
        </div>
      )}

      {/* Summary Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#DDDDDD] shadow-sm">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Total Sales</p>
          <p className="text-2xl font-extrabold text-[#CB2958] mt-1">₹{data.reduce((a, b) => a + b.sales, 0).toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ 16.4% YoY</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#DDDDDD] shadow-sm">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Total Revenue</p>
          <p className="text-2xl font-extrabold text-[#1D242E] mt-1">₹{data.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ 22.1% YoY</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#DDDDDD] shadow-sm">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Total Orders</p>
          <p className="text-2xl font-extrabold text-[#1D242E] mt-1">{data.reduce((a, b) => a + b.orders, 0).toLocaleString()}</p>
          <p className="text-[11px] text-[#CB2958] mt-1 font-semibold">Processed</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#DDDDDD] shadow-sm">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Avg Growth Rate</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {(data.reduce((a, b) => a + b.growth, 0) / (data.length || 1)).toFixed(1)}%
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Positive expansion</p>
        </div>
      </div>

      {/* MULTI-FORMAT VISUALIZATION FORMAT SWITCHER */}
      <div className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#DDDDDD]">
          <h2 className="font-bold text-[#1D242E] text-lg">Statistical Visualization Mode</h2>
          
          <div className="flex bg-[#EEEEEE] p-1 rounded-xl gap-1">
            {[
              { format: 'bar', label: 'Bar', icon: BarChart3 },
              { format: 'line', label: 'Line', icon: LineIcon },
              { format: 'area', label: 'Area', icon: TrendingUp },
              { format: 'pie', label: 'Pie', icon: PieIcon },
              { format: 'table', label: 'Table', icon: TableIcon },
            ].map((item) => {
              const Icon = item.icon
              const isActive = activeFormat === item.format
              return (
                <button
                  key={item.format}
                  onClick={() => setActiveFormat(item.format as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#CB2958] shadow-sm'
                      : 'text-[#6B7280] hover:text-[#1D242E]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* RENDER TABLE SEPARATELY OR RECHARTS IN RESPONSIVE CONTAINER */}
        {activeFormat === 'table' ? (
          <div className="overflow-x-auto border border-[#DDDDDD] rounded-xl bg-white">
            <table className="w-full text-xs text-left text-[#1D242E]">
              <thead className="text-xs font-bold text-[#1D242E] uppercase bg-[#EEEEEE] border-b border-[#DDDDDD]">
                <tr>
                  <th className="px-4 py-3.5">Category / Product</th>
                  <th className="px-4 py-3.5">Sales Volume (₹)</th>
                  <th className="px-4 py-3.5">Gross Revenue (₹)</th>
                  <th className="px-4 py-3.5">Total Orders</th>
                  <th className="px-4 py-3.5">Growth Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDDDD] font-mono">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3.5 font-bold text-[#1D242E]">{row.name}</td>
                    <td className="px-4 py-3.5 font-bold text-[#CB2958]">₹{row.sales.toLocaleString()}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">₹{row.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-[#1D242E]">{row.orders}</td>
                    <td className="px-4 py-3.5 text-emerald-600 font-bold">+{row.growth}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#EEEEEE] font-bold border-t border-[#DDDDDD] text-xs">
                <tr>
                  <td className="px-4 py-3 text-[#1D242E]">Total / Average</td>
                  <td className="px-4 py-3 text-[#CB2958]">₹{data.reduce((a, b) => a + b.sales, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-700">₹{data.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#1D242E]">{data.reduce((a, b) => a + b.orders, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-700">+{(data.reduce((a, b) => a + b.growth, 0) / data.length).toFixed(1)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeFormat === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#CB2958" name="Sales (₹)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : activeFormat === 'line' ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#CB2958" strokeWidth={3} name="Sales (₹)" />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue (₹)" />
                </LineChart>
              ) : activeFormat === 'area' ? (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" fill="#CB2958" stroke="#A91F49" fillOpacity={0.3} name="Revenue (₹)" />
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie data={data} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={105} label>
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
