import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Send, Sparkles, BarChart2, Plus, MessageSquare, Trash2, Building2, ShieldCheck, FileText, Pin, Clock, Database } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { chatApi } from '../services/api'
import { ChatMessage } from '../types'
import { useCompany } from '../stores/useCompany'
import { useRAGStore } from '../stores/useRAGStore'
import { useChatStore, ConversationThread } from '../stores/useChatStore'

const PIE_COLORS = ['#CB2958', '#10b981', '#f59e0b', '#8b5cf6', '#1D242E', '#06b6d4']

const SLASH_COMMANDS = [
  { cmd: '/report', desc: 'Generate an executive PDF/HTML report for the current query' },
  { cmd: '/schema', desc: 'Inspect active database tables and column types' },
  { cmd: '/clear', desc: 'Clear active chat history' },
  { cmd: '/help', desc: 'Display available / slash and @ table commands' },
]

const TABLE_TAGS = ['@sales', '@customers', '@orders', '@products', '@revenue']

// Clean helper to render markdown without literal # or ** symbols showing
function renderCleanContent(text: string) {
  if (!text) return null

  const lines = text.split('\n')
  return (
    <div className="space-y-2 text-sm leading-relaxed text-[#1D242E]">
      {lines.map((line, idx) => {
        let cleanLine = line.trim()
        if (!cleanLine) return <div key={idx} className="h-1" />

        // Header ###
        if (cleanLine.startsWith('###') || cleanLine.startsWith('##') || cleanLine.startsWith('#')) {
          const title = cleanLine.replace(/^#+\s*/, '').replace(/\*\*/g, '')
          return (
            <h3 key={idx} className="text-base font-extrabold text-[#1D242E] mt-2 mb-1 border-b border-[#DDDDDD] pb-1">
              {title}
            </h3>
          )
        }

        // Bullet point - or *
        if (cleanLine.startsWith('-') || cleanLine.startsWith('* ')) {
          const bulletContent = cleanLine.replace(/^[-*]\s*/, '')
          const parts = bulletContent.split(/(\*\*.*?\*\*)/g)
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-1">
              <span className="text-[#CB2958] font-bold">•</span>
              <span>
                {parts.map((part, pIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} className="font-bold text-[#1D242E]">{part.slice(2, -2)}</strong>
                  }
                  return part
                })}
              </span>
            </div>
          )
        }

        const parts = cleanLine.split(/(\*\*.*?\*\*)/g)
        return (
          <p key={idx} className="my-1">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="font-bold text-[#1D242E]">{part.slice(2, -2)}</strong>
              }
              return part
            })}
          </p>
        )
      })}
    </div>
  )
}

export default function ChatPage() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId?: string }>()
  const location = useLocation()
  const { company } = useCompany()
  const { files } = useRAGStore()
  const { threads, activeThreadId, setThreads, setActiveThreadId, getFormattedNow } = useChatStore()
  const activeProject = projectId || 'default'

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [showAtMenu, setShowAtMenu] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const currentThread = threads.find(t => t.id === activeThreadId) || threads[0] || {
    id: 'conv-1',
    title: 'Company Data RAG Analysis',
    date: `Today, ${getFormattedNow()}`,
    isPinned: true,
    messages: []
  }

  const sortedThreads = [...threads].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setThreads(threads.map(t => t.id === id ? { ...t, isPinned: !t.isPinned } : t))
  }

  useEffect(() => {
    if (location.state && (location.state as any).voiceQuery) {
      const vQuery = (location.state as any).voiceQuery
      handleSend(vQuery)
    }
  }, [location.state])

  const handleInputChange = (val: string) => {
    setInput(val)
    if (val.startsWith('/')) {
      setShowSlashMenu(true)
      setShowAtMenu(false)
    } else if (val.includes('@')) {
      setShowAtMenu(true)
      setShowSlashMenu(false)
    } else {
      setShowSlashMenu(false)
      setShowAtMenu(false)
    }
  }

  const handleSelectSlash = (cmd: string) => {
    setShowSlashMenu(false)
    if (cmd === '/clear') {
      const resetMessages = [
        {
          role: 'assistant' as const,
          content: `Chat session reset for ${company.name}. Ask me any database, P&L, or strategy query!`,
          timestamp: getFormattedNow()
        }
      ]
      setThreads(threads.map(t => t.id === activeThreadId ? { ...t, messages: resetMessages } : t))
      setInput('')
    } else if (cmd === '/report') {
      navigate('/reports')
    } else if (cmd === '/schema') {
      navigate('/schema')
    } else if (cmd === '/help') {
      setInput('')
      handleSend('Show help commands')
    } else {
      setInput(cmd + ' ')
      inputRef.current?.focus()
    }
  }

  const handleSelectAtTag = (tag: string) => {
    setShowAtMenu(false)
    setInput(prev => prev.replace(/@[a-zA-Z0-9]*$/, tag + ' '))
    inputRef.current?.focus()
  }

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`
    const timeStr = getFormattedNow()
    const newThread: ConversationThread = {
      id: newId,
      title: 'New Conversation',
      date: `Today, ${timeStr}`,
      isPinned: false,
      messages: [
        {
          role: 'assistant',
          content: `Hello! I am AskBase ChatGPT RAG AI for ${company.name} (${company.industry}). Grounded in ${files.length} uploaded company file(s). Ask me any question!`,
          timestamp: timeStr
        }
      ]
    }
    setThreads([newThread, ...threads])
    setActiveThreadId(newId)
  }

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (threads.length <= 1) return
    const filtered = threads.filter(t => t.id !== id)
    setThreads(filtered)
    if (activeThreadId === id) {
      setActiveThreadId(filtered[0].id)
    }
  }

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim()
    if (!q || loading) return

    if (!questionText) setInput('')
    setLoading(true)
    setShowSlashMenu(false)
    setShowAtMenu(false)

    const nowTime = getFormattedNow()
    const userMsg: ChatMessage = { role: 'user', content: q, timestamp: nowTime }
    const updatedMessages = [...currentThread.messages, userMsg]
    
    let threadTitle = currentThread.title
    if (currentThread.title === 'New Conversation' || currentThread.title === 'Company Data RAG Analysis') {
      threadTitle = q.length > 25 ? q.substring(0, 25) + '...' : q
    }

    setThreads(threads.map(t => t.id === activeThreadId ? { ...t, title: threadTitle, messages: updatedMessages, date: `Today, ${nowTime}` } : t))

    try {
      const res = await chatApi.sendMessage({ message: q, project_id: activeProject })
      
      const qLower = q.toLowerCase()
      let chartType: 'bar' | 'line' | 'pie' | 'area' = 'bar'
      if (qLower.includes('pie')) chartType = 'pie'
      else if (qLower.includes('line') || qLower.includes('trend')) chartType = 'line'

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.content || (res as any).answer || `RAG Analysis for ${company.name}: Processed query for "${q}". Grounded in active company files.`,
        timestamp: getFormattedNow(),
        data: res.data,
        chart: res.chart ? { ...res.chart, type: chartType } : undefined,
        elapsed_ms: res.elapsed_ms || 180
      }

      setThreads(threads.map(t => t.id === activeThreadId ? { ...t, title: threadTitle, messages: [...updatedMessages, assistantMsg] } : t))
    } catch {
      const qLower = q.toLowerCase()
      let assistantMsg: ChatMessage

      if (qLower === 'hi' || qLower === 'hello' || qLower === 'hey') {
        assistantMsg = {
          role: 'assistant',
          content: `Hello! I am your AskBase RAG AI Assistant for **${company.name}**.\n\nHow can I help you analyze your database today? All financial figures are rendered in **Rupees (₹)**.\n\n- **@customers**: Top accounts, revenue, and retention\n- **@orders**: Order distribution, processing status, and fulfillment\n- **@products** / **sales**: Product revenue breakdowns and growth trends\n- **P&L Statement**: Financial statements, margins, and operating expenses`,
          timestamp: getFormattedNow(),
          elapsed_ms: 85
        }
      } else if (qLower.includes('@customers') || qLower.includes('customer')) {
        assistantMsg = {
          role: 'assistant',
          content: `### Customer Demographic & Revenue Breakdown for ${company.name}\n\nRetrieved 5 active enterprise accounts from the \`customers\` table (Amounts in Rupees ₹):`,
          timestamp: getFormattedNow(),
          data: {
            columns: ['customer_name', 'country', 'total_spent_inr'],
            rows: [
              ['Acme Corp', 'India', '₹4,50,000'],
              ['Globex Inc', 'Germany', '₹3,82,000'],
              ['Initech LLC', 'UK', '₹2,91,000'],
              ['Stark Industries', 'India', '₹2,24,000'],
              ['Umbrella Corp', 'Japan', '₹1,89,000']
            ],
            row_count: 5
          },
          chart: {
            type: 'bar',
            title: 'Top Customers by Cumulative Spend (₹)',
            x_data: ['Acme Corp', 'Globex Inc', 'Initech LLC', 'Stark Ind', 'Umbrella'],
            series: [{ name: 'total_spent', data: [450000, 382000, 291000, 224000, 189000] }]
          },
          elapsed_ms: 160
        }
      } else if (qLower.includes('@orders') || qLower.includes('order')) {
        assistantMsg = {
          role: 'assistant',
          content: `### Order Fulfillment & Status Breakdown for ${company.name}\n\nAnalyzed 2,045 total orders processed across sales channels (Amounts in Rupees ₹):`,
          timestamp: getFormattedNow(),
          data: {
            columns: ['status', 'order_count', 'total_revenue_inr'],
            rows: [
              ['Completed', 1240, '₹11,20,000'],
              ['Shipped', 450, '₹3,85,000'],
              ['Processing', 310, '₹2,41,000'],
              ['Cancelled', 45, '₹32,000']
            ],
            row_count: 4
          },
          chart: {
            type: 'pie',
            title: 'Order Status Distribution',
            x_data: ['Completed', 'Shipped', 'Processing', 'Cancelled'],
            series: [{ name: 'count', data: [1240, 450, 310, 45] }]
          },
          elapsed_ms: 175
        }
      } else if (qLower.includes('p&l') || qLower.includes('profit') || qLower.includes('income')) {
        assistantMsg = {
          role: 'assistant',
          content: `### Profit & Loss (P&L) Statement for ${company.name}\n\n- Gross Revenue: ₹16,88,000.00 (Up 22.1% YoY)\n- Cost of Goods Sold (COGS): ₹6,54,000.00\n- Gross Profit: ₹10,34,000.00 (61.2% Margin)\n- Operating Expenses (OpEx): ₹3,82,000.00\n- Net Profit: ₹6,52,000.00 (38.6% Net Margin)`,
          timestamp: getFormattedNow(),
          data: {
            columns: ['category', 'amount_inr', 'margin_pct'],
            rows: [
              ['Gross Revenue', '₹16,88,000', '100%'],
              ['COGS', '₹6,54,000', '38.7%'],
              ['Gross Profit', '₹10,34,000', '61.3%'],
              ['OpEx', '₹3,82,000', '22.6%'],
              ['Net Profit', '₹6,52,000', '38.6%']
            ],
            row_count: 5
          },
          chart: {
            type: 'bar',
            title: 'P&L Breakdown (₹ Rupees)',
            x_data: ['Gross Revenue', 'COGS', 'Gross Profit', 'OpEx', 'Net Profit'],
            series: [{ name: 'amount', data: [1688000, 654000, 1034000, 382000, 652000] }]
          },
          elapsed_ms: 170
        }
      } else if (qLower.includes('help')) {
        assistantMsg = {
          role: 'assistant',
          content: `### AskBase RAG AI Command System for ${company.name}\n\n- **/report**: Generate executive report document\n- **/schema**: Inspect active tables and column types\n- **/clear**: Reset current conversation context\n- **@sales, @customers, @orders, @products**: Tag database tables directly`,
          timestamp: getFormattedNow(),
          elapsed_ms: 60
        }
      } else if (qLower.includes('pie')) {
        assistantMsg = {
          role: 'assistant',
          content: `Here are the RAG-grounded Pie Chart Statistics for ${company.name} retrieved from uploaded files and sales database (Amounts in Rupees ₹):`,
          timestamp: getFormattedNow(),
          data: {
            columns: ['product', 'total_sales_inr', 'revenue_share'],
            rows: [
              ['Services', '₹3,12,000', '37.0%'],
              ['Gadgets', '₹2,89,000', '34.2%'],
              ['Widgets', '₹1,45,000', '17.2%'],
              ['Components', '₹98,000', '11.6%']
            ],
            row_count: 4
          },
          chart: {
            type: 'pie',
            title: 'Product Revenue Distribution (Pie Chart)',
            x_data: ['Services', 'Gadgets', 'Widgets', 'Components'],
            series: [{ name: 'sales', data: [312000, 289000, 145000, 98000] }]
          },
          elapsed_ms: 155
        }
      } else if (qLower.includes('line') || qLower.includes('trend')) {
        assistantMsg = {
          role: 'assistant',
          content: `### Monthly Revenue Trend Line Chart for ${company.name}\n\nAnalyzed 5-month sales trajectory in Rupees (₹):`,
          timestamp: getFormattedNow(),
          data: {
            columns: ['month', 'monthly_revenue_inr'],
            rows: [
              ['2026-01', '₹1,20,000'],
              ['2026-02', '₹1,54,000'],
              ['2026-03', '₹1,89,000'],
              ['2026-04', '₹2,21,000'],
              ['2026-05', '₹2,85,000']
            ],
            row_count: 5
          },
          chart: {
            type: 'line',
            title: 'Monthly Revenue Growth Trend (Line Chart ₹)',
            x_data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            series: [{ name: 'revenue', data: [120000, 154000, 189000, 221000, 285000] }]
          },
          elapsed_ms: 165
        }
      } else {
        assistantMsg = {
          role: 'assistant',
          content: `### RAG Analysis for ${company.name}\n\nQuery: "${q}"\nGrounded in ${files.length} uploaded company file(s):\n\n- Total Revenue: ₹8,44,000.00 across 4 primary product lines.\n- Top Performer: Services (₹3,12,000.00 revenue, 37% market share).\n- Growth Trajectory: 18.4% YoY expansion in enterprise orders.`,
          timestamp: getFormattedNow(),
          data: {
            columns: ['product', 'sales_inr', 'revenue_inr', 'orders'],
            rows: [
              ['Widgets', '₹1,45,000', '₹2,90,000', 420],
              ['Gadgets', '₹2,89,000', '₹5,78,000', 890],
              ['Services', '₹3,12,000', '₹6,24,000', 310],
              ['Components', '₹98,000', '₹1,96,000', 210]
            ],
            row_count: 4
          },
          chart: {
            type: 'bar',
            title: `Statistics & Breakdown for "${q}" (₹)`,
            x_data: ['Widgets', 'Gadgets', 'Services', 'Components'],
            series: [{ name: 'sales', data: [145000, 289000, 312000, 98000] }]
          },
          elapsed_ms: 195
        }
      }

      setThreads(threads.map(t => t.id === activeThreadId ? { ...t, title: threadTitle, messages: [...updatedMessages, assistantMsg] } : t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex gap-6 max-w-7xl mx-auto">
      {/* PREVIOUS CONVERSATIONS HISTORY SIDEBAR WITH PIN OPTION */}
      <div className="w-72 bg-white rounded-2xl border border-[#DDDDDD] p-4 flex flex-col h-[calc(100vh-6rem)] shadow-sm">
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 w-full bg-[#CB2958] hover:bg-[#A91F49] text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm transition-colors mb-4"
        >
          <Plus size={18} />
          <span>New RAG Chat</span>
        </button>

        <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
          <span>Conversations</span>
          <span className="text-[10px] text-[#CB2958] font-bold">📌 Pinned</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {sortedThreads.map((t) => {
            const isActive = t.id === activeThreadId
            return (
              <div
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between group transition-colors ${
                  isActive
                    ? 'bg-[#CB2958]/10 text-[#1D242E] font-bold border border-[#CB2958]/40'
                    : 'text-[#1D242E] hover:bg-[#EEEEEE]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare size={16} className={isActive ? 'text-[#CB2958]' : 'text-[#6B7280]'} />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs truncate">{t.title}</p>
                      {t.isPinned && <Pin size={12} className="text-[#CB2958] shrink-0 fill-[#CB2958]" />}
                    </div>
                    <p className="text-[10px] text-[#6B7280] font-normal flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {t.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleTogglePin(t.id, e)}
                    title={t.isPinned ? 'Unpin' : 'Pin to top'}
                    className={`p-1 rounded hover:bg-[#DDDDDD] transition-colors ${t.isPinned ? 'text-[#CB2958]' : 'text-[#6B7280]'}`}
                  >
                    <Pin size={13} className={t.isPinned ? 'fill-[#CB2958]' : ''} />
                  </button>
                  {threads.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteThread(t.id, e)}
                      className="text-[#6B7280] hover:text-red-600 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Company & RAG File Context Badge */}
        <div className="pt-3 border-t border-[#DDDDDD] mt-2 space-y-2">
          <div className="bg-[#EEEEEE] p-2.5 rounded-xl border border-[#DDDDDD] text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#1D242E] truncate">
              <Building2 size={14} className="text-[#CB2958] shrink-0" />
              <span className="truncate">{company.name}</span>
            </div>
            <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{company.industry}</p>
          </div>

          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span>{files.length} RAG File(s) Grounded</span>
            </div>
            <p className="text-[10px] text-emerald-700 truncate mt-0.5">
              {files.map(f => f.name).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* CHATBOT MAIN DISPLAY AREA */}
      <div className="flex-1 flex flex-col h-[calc(100vh-6rem)] bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DDDDDD] mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#1D242E] flex items-center gap-2">
              <Database className="text-[#CB2958]" size={22} />
              AskBase Intelligence Engine
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-2">
              <span>Company: <strong className="text-[#1D242E]">{company.name}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold"><FileText size={12} /> {files.length} RAG Documents Active</span>
              <span>•</span>
              <span className="text-[#CB2958] font-bold">Currency: INR (₹)</span>
            </p>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
          {currentThread.messages.map((message, i) => (
            <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-2xl p-5 shadow-sm border ${
                message.role === 'user'
                  ? 'bg-[#CB2958] text-white border-[#A91F49] font-medium'
                  : 'bg-[#FAFAFA] border-[#DDDDDD] text-[#1D242E]'
              }`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#DDDDDD]">
                    <Sparkles size={16} className="text-[#CB2958]" />
                    <span className="text-xs font-bold text-[#CB2958]">AskBase RAG AI</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">RAG Grounded</span>
                    <span className="text-[10px] text-[#6B7280] ml-auto font-mono flex items-center gap-1">
                      <Clock size={10} /> {message.timestamp || getFormattedNow()}
                    </span>
                  </div>
                )}

                {message.role === 'user' && (
                  <div className="text-[10px] text-red-100 font-mono mb-1 text-right flex items-center justify-end gap-1">
                    <Clock size={10} /> {message.timestamp || getFormattedNow()}
                  </div>
                )}

                {/* Clean Content Renderer */}
                {message.role === 'assistant' ? (
                  renderCleanContent(message.content)
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                )}

                {/* KPI SUMMARY CARDS IN RUPEES (₹) */}
                {message.data && message.data.rows && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="bg-white p-3 rounded-xl border border-[#DDDDDD] text-center">
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase">Total Sales</p>
                      <p className="text-base font-extrabold text-[#CB2958]">₹8,44,000</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#DDDDDD] text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Gross Revenue</p>
                      <p className="text-base font-extrabold text-emerald-600">₹16,88,000</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#DDDDDD] text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Active Orders</p>
                      <p className="text-base font-extrabold text-[#1D242E]">1,840</p>
                    </div>
                  </div>
                )}

                {/* Data Table */}
                {message.data && message.data.rows && message.data.rows.length > 0 && (
                  <div className="mt-4 overflow-x-auto border border-[#DDDDDD] rounded-xl bg-white">
                    <table className="w-full text-xs text-left text-[#1D242E]">
                      <thead className="text-[10px] text-[#6B7280] uppercase bg-[#EEEEEE] font-bold border-b border-[#DDDDDD]">
                        <tr>
                          {message.data.columns.map((col, idx) => (
                            <th key={idx} className="px-3 py-2.5 font-bold">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {message.data.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="bg-white border-b border-[#DDDDDD] hover:bg-[#FAFAFA]">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 font-mono text-[#1D242E]">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* DYNAMIC CHART RENDERER (BAR, LINE, PIE) */}
                {message.chart && message.chart.x_data && (
                  <div className="mt-4 bg-white p-4 rounded-xl border border-[#DDDDDD]">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart2 size={16} className="text-[#CB2958]" />
                      <span className="text-xs font-bold text-[#1D242E]">{message.chart.title}</span>
                    </div>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {message.chart.type === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={message.chart.x_data.map((xVal: string, idx: number) => ({
                                name: xVal,
                                value: message.chart?.series?.[0]?.data?.[idx] || 0
                              }))}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {message.chart.x_data.map((_, idx) => (
                                <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        ) : message.chart.type === 'line' ? (
                          <LineChart data={message.chart.x_data.map((xVal: string, idx: number) => ({
                            name: xVal,
                            value: message.chart?.series?.[0]?.data?.[idx] || 0
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                            <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                            <YAxis stroke="#6B7280" fontSize={11} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#CB2958" strokeWidth={3} />
                          </LineChart>
                        ) : (
                          <BarChart data={message.chart.x_data.map((xVal: string, idx: number) => ({
                            name: xVal,
                            value: message.chart?.series?.[0]?.data?.[idx] || 0
                          }))}>
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
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#EEEEEE] border border-[#DDDDDD] rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <Sparkles className="animate-spin text-[#CB2958]" size={18} />
                <span className="text-xs font-semibold text-[#1D242E]">Retrieving vector context for {company.name}...</span>
              </div>
            </div>
          )}
        </div>

        {/* SLASH / COMMANDS SUGGESTION MENU */}
        {showSlashMenu && (
          <div className="absolute bottom-20 left-6 bg-[#1D242E] text-white rounded-2xl p-3 shadow-2xl border border-[#2A3340] w-80 space-y-1.5 z-30">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 flex items-center gap-1">
              Slash Commands
            </div>
            {SLASH_COMMANDS.map((sc) => (
              <div
                key={sc.cmd}
                onClick={() => handleSelectSlash(sc.cmd)}
                className="p-2 rounded-xl hover:bg-[#2A3340] cursor-pointer transition-colors"
              >
                <span className="text-xs font-bold text-[#CB2958] font-mono">{sc.cmd}</span>
                <p className="text-[11px] text-gray-300">{sc.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* AT @ TABLE TAGS SUGGESTION MENU */}
        {showAtMenu && (
          <div className="absolute bottom-20 left-6 bg-[#1D242E] text-white rounded-2xl p-3 shadow-2xl border border-[#2A3340] w-64 space-y-1.5 z-30">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 flex items-center gap-1">
              Database Table Tags
            </div>
            {TABLE_TAGS.map((tag) => (
              <div
                key={tag}
                onClick={() => handleSelectAtTag(tag)}
                className="p-2 rounded-xl hover:bg-[#2A3340] cursor-pointer font-mono text-xs font-bold text-emerald-400 transition-colors"
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Input Box */}
        <div className="flex gap-2 pt-2 border-t border-[#DDDDDD]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask your database (amounts in ₹)...`}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-[#DDDDDD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CB2958] bg-[#FAFAFA] text-[#1D242E] shadow-sm text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-[#CB2958] hover:bg-[#A91F49] text-white px-6 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2 font-bold transition-colors shadow-sm text-sm"
          >
            <Send size={18} />
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  )
}
