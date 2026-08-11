import { FileText, Download, Plus } from 'lucide-react'

const reports = [
 { id: 1, name: 'Q3 Revenue Report', format: 'PDF', size: '2.4 MB', date: '2024-10-15' },
 { id: 2, name: 'Marketing Analysis', format: 'PPTX', size: '5.1 MB', date: '2024-10-10' },
 { id: 3, name: 'Customer Insights', format: 'PDF', size: '1.8 MB', date: '2024-10-05' },
]

export default function ReportsPage() {
 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
 <p className="text-gray-600 mt-1">Generate and manage reports</p>
 </div>
 <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
 <Plus size={20} />
 <span>Generate Report</span>
 </button>
 </div>
 <div className="bg-white rounded-lg shadow">
 <div className="divide-y divide-gray-200">
 {reports.map((report) => (
 <div key={report.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-red-100 rounded-lg">
 <FileText className="text-red-600" size={24} />
 </div>
 <div>
 <h3 className="font-semibold text-gray-900">{report.name}</h3>
 <p className="text-sm text-gray-600">{report.format} • {report.size} • {report.date}</p>
 </div>
 </div>
 <button className="p-2 hover:bg-gray-200 rounded-lg">
 <Download size={20} />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 )
}
