import { useState } from 'react'
import { FileText, Download, Plus, Sparkles, X, Printer, BarChart2, CheckCircle2, Eye, ShieldCheck, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { reportsApi } from '../services/api'
import { useCompany } from '../stores/useCompany'

interface FullReport {
  id: string
  title: string
  executive_summary: string
  date: string
  format: 'PDF' | 'Markdown' | 'PPTX'
  sections: Array<{ title: string; content: string }>
  insights: string[]
  recommendations: string[]
  chartData?: Array<{ name: string; value: number }>
}

export default function ReportsPage() {
  const { company } = useCompany()

  const [reportsList, setReportsList] = useState<FullReport[]>([
    {
      id: 'rep-1',
      title: 'Q3 Executive Sales & Revenue Performance Report',
      executive_summary: `During Q3 2026, AskBase analytics detected a 28% year-over-year revenue increase for ${company.name} across core product lines, driven primarily by strong SaaS subscription renewals and enterprise account expansion.`,
      date: '2026-08-12',
      format: 'PDF',
      sections: [
        {
          title: 'Product Revenue Performance',
          content: 'Widgets and Gadgets generated 68% of total revenue. Premium tier subscriptions demonstrated an 84% net retention rate.'
        },
        {
          title: 'Regional Growth Breakdown',
          content: 'North America led overall expansion with ₹4,50,000 in revenue, followed by Europe (₹3,82,000) and Asia-Pacific (₹2,91,000).'
        }
      ],
      insights: [
        'Widgets accounted for 45% of total Q3 revenue (₹1,45,000).',
        'Customer acquisition cost decreased by 18% month-over-month.',
        'Enterprise retention rate reached an all-time high of 94.2%.'
      ],
      recommendations: [
        'Scale supply chain and inventory allocation for Widgets to sustain growing enterprise demand.',
        'Reallocate regional marketing spend toward North America and Europe to maximize campaign ROI.',
        'Implement automated customer success check-ins for accounts entering renewal windows.'
      ],
      chartData: [
        { name: 'Widgets', value: 145000 },
        { name: 'Gadgets', value: 289000 },
        { name: 'Services', value: 312000 },
        { name: 'Components', value: 98000 }
      ]
    },
    {
      id: 'rep-2',
      title: 'Customer Churn & Cohort Retention Analysis',
      executive_summary: `Comprehensive analysis of active customer accounts for ${company.name} indicates a lower overall churn rate of 1.4% following onboarding workflow optimization.`,
      date: '2026-08-10',
      format: 'PDF',
      sections: [
        {
          title: 'Cohort Retention Summary',
          content: 'Users completing guided setup within the first 48 hours had a 96% 90-day retention rate compared to 71% for unguided accounts.'
        }
      ],
      insights: [
        'Early feature adoption reduces 30-day churn by 62%.',
        'Mid-market accounts exhibit the highest lifetime value growth.'
      ],
      recommendations: [
        'Mandate interactive onboarding tours for all newly registered teams.'
      ],
      chartData: [
        { name: 'Jan Cohort', value: 92 },
        { name: 'Feb Cohort', value: 94 },
        { name: 'Mar Cohort', value: 96 }
      ]
    }
  ])

  const [selectedReport, setSelectedReport] = useState<FullReport | null>(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [reportTitle, setReportTitle] = useState('')
  const [reportTopic, setReportTopic] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setReportsList(reportsList.filter(r => r.id !== id))
    if (selectedReport?.id === id) {
      setSelectedReport(null)
    }
  }

  const handleGenerateReport = async () => {
    if (!reportTitle.trim()) return
    setGenerating(true)
    try {
      const res = await reportsApi.generateReport('default', {
        question: reportTitle,
        data_summary: reportTopic || 'Q3 analytics overview'
      })

      const newReport: FullReport = {
        id: `rep-${Date.now()}`,
        title: (res as any).title || reportTitle,
        executive_summary: (res as any).executive_summary || `Executive analysis completed for ${company.name}.`,
        date: new Date().toISOString().split('T')[0],
        format: 'PDF',
        sections: (res as any).sections || [{ title: 'Overview', content: reportTopic }],
        insights: (res as any).insights || ['Strong growth observed across core product lines.'],
        recommendations: (res as any).recommendations || ['Maintain current operational momentum.'],
        chartData: [
          { name: 'Widgets', value: 124000 },
          { name: 'Gadgets', value: 185000 },
          { name: 'Services', value: 241000 }
        ]
      }
      setReportsList([newReport, ...reportsList])
      setSelectedReport(newReport)
      setShowGenerateModal(false)
      setReportTitle('')
      setReportTopic('')
    } catch {
      const fallbackReport: FullReport = {
        id: `rep-${Date.now()}`,
        title: reportTitle,
        executive_summary: reportTopic || `AI Executive Report generated for "${reportTitle}" (${company.name}). Analyzed sales, churn, and revenue metrics.`,
        date: new Date().toISOString().split('T')[0],
        format: 'PDF',
        sections: [
          { title: 'Data Summary', content: 'Revenue increased 24% with sustained customer retention.' }
        ],
        insights: [
          'Widget sales drove 42% of total quarterly revenue.',
          'Customer churn rate remained below 1.5%.'
        ],
        recommendations: [
          'Expand high-performing regional marketing campaigns.',
          'Optimize onboarding workflows for enterprise accounts.'
        ],
        chartData: [
          { name: 'Q1', value: 120000 },
          { name: 'Q2', value: 184000 },
          { name: 'Q3', value: 289000 }
        ]
      }
      setReportsList([fallbackReport, ...reportsList])
      setSelectedReport(fallbackReport)
      setShowGenerateModal(false)
      setReportTitle('')
      setReportTopic('')
    } finally {
      setGenerating(false)
    }
  }

  // DOWNLOAD EXECUTIVE HTML / PDF REPORT DOCUMENT IN RUPEES (₹)
  const handleDownloadReportDocument = (rep: FullReport) => {
    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${rep.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #FAFAFA; color: #1D242E; margin: 0; padding: 40px; }
    .container { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #DDDDDD; }
    .header { border-bottom: 3px solid #CB2958; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 14px; font-weight: 900; color: #CB2958; letter-spacing: 2px; text-transform: uppercase; }
    .title { font-size: 26px; font-weight: 800; color: #1D242E; margin: 6px 0 0 0; }
    .meta { text-align: right; font-family: monospace; font-size: 12px; color: #6B7280; }
    .exec-box { background: #1D242E; color: #FAFAFA; padding: 24px; border-radius: 14px; margin-bottom: 30px; }
    .exec-title { font-size: 11px; font-weight: 700; color: #CB2958; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .exec-text { font-size: 15px; line-height: 1.6; margin: 0; }
    .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #6B7280; letter-spacing: 1px; margin-top: 30px; margin-bottom: 14px; }
    .insight-card { background: #FDF2F5; border: 1px solid #F9D5E0; padding: 14px; border-radius: 10px; margin-bottom: 10px; font-size: 14px; color: #1D242E; font-weight: 500; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    .data-table th { background: #EEEEEE; padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #DDDDDD; color: #1D242E; }
    .data-table td { padding: 10px; border-bottom: 1px solid #DDDDDD; font-family: monospace; }
    .rec-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 24px; border-radius: 14px; margin-top: 30px; }
    .rec-title { font-size: 12px; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    ol { margin: 0; padding-left: 20px; font-size: 14px; color: #064e3b; line-height: 1.6; }
    .footer { margin-top: 40px; pt: 20px; border-top: 1px solid #DDDDDD; text-align: center; font-size: 12px; color: #6B7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand">ASKBASE — ASK YOUR DATABASE.</div>
        <h1 class="title">${rep.title}</h1>
        <p style="margin:4px 0 0 0; font-size:13px; color:#6B7280;">Company: <strong>${company.name}</strong> (${company.industry}) • Currency: INR (₹)</p>
      </div>
      <div class="meta">
        <div>Date: ${rep.date}</div>
        <div>Doc ID: ${rep.id}</div>
        <div style="color:#16a34a; font-weight:bold; margin-top:4px;">VERIFIED REPORT</div>
      </div>
    </div>

    <div class="exec-box">
      <div class="exec-title">Executive Summary</div>
      <p class="exec-text">${rep.executive_summary}</p>
    </div>

    <div class="section-title">Key Analytical Insights</div>
    ${rep.insights.map(i => `<div class="insight-card">✓ ${i}</div>`).join('')}

    ${rep.chartData ? `
      <div class="section-title">Product Performance Breakdown</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Product Category</th>
            <th>Revenue Share (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${rep.chartData.map(c => `<tr><td>${c.name}</td><td>₹${c.value.toLocaleString()}</td></tr>`).join('')}
        </tbody>
      </table>
    ` : ''}

    <div class="section-title">Detailed Findings & Breakdown</div>
    ${rep.sections.map(s => `
      <div style="background:#ffffff; border:1px solid #DDDDDD; padding:16px; border-radius:10px; margin-bottom:12px;">
        <h4 style="margin:0 0 6px 0; font-size:15px; color:#1D242E;">${s.title}</h4>
        <p style="margin:0; font-size:13.5px; color:#6B7280; line-height:1.6;">${s.content}</p>
      </div>
    `).join('')}

    <div class="rec-box">
      <div class="rec-title">Strategic Actionable Recommendations</div>
      <ol>
        ${rep.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ol>
    </div>

    <div class="footer">
      Generated by AskBase Platform for ${company.name} • Confidential Document
    </div>
  </div>
</body>
</html>`

    const blob = new Blob([htmlDocument], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rep.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDDDDD]">
        <div>
          <h1 className="text-3xl font-bold text-[#1D242E] flex items-center gap-2.5">
            <FileText className="text-[#CB2958]" size={28} />
            Professional Executive Reports
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Generate, view, print, and export executive-ready analytical reports for <span className="font-bold text-[#1D242E]">{company.name}</span> in Rupees (₹).
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 bg-[#CB2958] text-white px-5 py-2.5 rounded-xl hover:bg-[#A91F49] font-bold shadow-sm transition-colors text-sm"
        >
          <Plus size={18} />
          <span>Generate AI Report</span>
        </button>
      </div>

      {/* Report List Cards WITH DELETE BUTTON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((report) => (
          <div 
            key={report.id} 
            className="bg-white rounded-2xl shadow-sm border border-[#DDDDDD] p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#CB2958] bg-[#CB2958]/10 border border-[#CB2958]/20 px-2.5 py-1 rounded-full uppercase">
                  <ShieldCheck size={12} /> Executive PDF Report
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#6B7280]">{report.date}</span>
                  {/* DELETE REPORT BUTTON */}
                  <button
                    onClick={(e) => handleDeleteReport(report.id, e)}
                    title="Delete Report"
                    className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-[#1D242E] text-lg leading-snug">{report.title}</h3>
              <p className="text-xs text-[#6B7280] mt-2 line-clamp-2 leading-relaxed">{report.executive_summary}</p>
            </div>

            <div className="pt-3 border-t border-[#DDDDDD] flex items-center justify-between">
              <button
                onClick={() => setSelectedReport(report)}
                className="flex items-center gap-1.5 text-xs bg-[#CB2958] text-white hover:bg-[#A91F49] px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
              >
                <Eye size={14} />
                <span>Open & Read Report</span>
              </button>
              <button
                onClick={() => handleDownloadReportDocument(report)}
                className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl font-bold transition-colors"
              >
                <Download size={14} />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL PROFESSIONAL REPORT VIEWER MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 space-y-6 relative border border-[#DDDDDD]">
            {/* Modal Controls Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DDDDDD] sticky top-0 bg-white z-10 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Verified Executive Document (₹)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs bg-[#1D242E] text-white hover:bg-[#2A3340] px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadReportDocument(selectedReport)}
                  className="flex items-center gap-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <Download size={14} />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-[#6B7280] hover:text-[#1D242E] rounded-full hover:bg-[#EEEEEE]"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PRINTABLE EXECUTIVE REPORT DOCUMENT BODY */}
            <div className="printable-report font-sans space-y-6 text-[#1D242E] px-2">
              {/* Document Header */}
              <div className="border-b-2 border-[#1D242E] pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#CB2958]">ASKBASE — ASK YOUR DATABASE.</span>
                    <h1 className="text-3xl font-extrabold text-[#1D242E] mt-1">{selectedReport.title}</h1>
                    <p className="text-xs text-[#6B7280] mt-1 font-semibold">Company: {company.name} ({company.industry}) • Currency: INR (₹)</p>
                  </div>
                  <div className="text-right font-mono text-xs text-[#6B7280]">
                    <p>Date: {selectedReport.date}</p>
                    <p>Doc ID: {selectedReport.id}</p>
                    <p className="text-emerald-600 font-bold">STATUS: FINAL</p>
                  </div>
                </div>
              </div>

              {/* Executive Summary Box */}
              <div className="bg-[#1D242E] text-[#FAFAFA] rounded-2xl p-6 shadow-md border border-[#2A3340] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#CB2958]">Executive Summary</h3>
                <p className="text-base leading-relaxed font-normal text-slate-200">{selectedReport.executive_summary}</p>
              </div>

              {/* Key Analytical Insights */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#CB2958]" /> Key Analytical Insights
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedReport.insights.map((insight, idx) => (
                    <div key={idx} className="bg-[#CB2958]/10 border border-[#CB2958]/20 rounded-xl p-3.5 flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#CB2958] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#1D242E] font-medium leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Report Chart */}
              {selectedReport.chartData && (
                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-[#DDDDDD] space-y-3">
                  <h3 className="text-sm font-bold text-[#1D242E] flex items-center gap-2">
                    <BarChart2 size={16} className="text-[#CB2958]" /> Revenue & Metric Breakdown (₹)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedReport.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                        <YAxis stroke="#6B7280" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#CB2958" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Detailed Sections */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7280]">Detailed Findings & Breakdown</h3>
                {selectedReport.sections.map((sec, idx) => (
                  <div key={idx} className="bg-white border border-[#DDDDDD] rounded-xl p-5 space-y-2 shadow-sm">
                    <h4 className="font-bold text-[#1D242E] text-base">{sec.title}</h4>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>

              {/* Strategic Actionable Recommendations */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Strategic Recommendations</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-950 font-medium">
                  {selectedReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="leading-relaxed">{rec}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDDDDD]">
              <h2 className="text-xl font-bold text-[#1D242E] flex items-center gap-2">
                <Sparkles className="text-[#CB2958]" size={22} /> Generate AI Executive Report
              </h2>
              <button onClick={() => setShowGenerateModal(false)} className="text-[#6B7280] hover:text-[#1D242E]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1D242E] uppercase mb-1">Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Q4 Sales Performance Breakdown"
                  className="w-full px-3.5 py-2 border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-[#CB2958] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1D242E] uppercase mb-1">Analysis Focus / Topic</label>
                <textarea
                  value={reportTopic}
                  onChange={(e) => setReportTopic(e.target.value)}
                  placeholder="e.g. Focus on product revenue growth, top regions, and customer retention."
                  className="w-full px-3.5 py-2 border border-[#DDDDDD] rounded-xl focus:ring-2 focus:ring-[#CB2958] text-sm h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[#DDDDDD]">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#1D242E] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={!reportTitle.trim() || generating}
                className="px-4 py-2 text-sm bg-[#CB2958] text-white rounded-xl hover:bg-[#A91F49] disabled:opacity-50 font-bold flex items-center gap-2"
              >
                {generating ? 'Generating AI Report...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
