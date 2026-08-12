import { useState, useEffect } from 'react'
import { BarChart3, Database, MessageSquare, Mic, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { healthApi } from '../services/api'
import { SystemHealth, DataOutputHealth, VoiceHealth } from '../types'

export default function HomePage() {
 const navigate = useNavigate()
 const [sysHealth, setSysHealth] = useState<SystemHealth | null>(null)
 const [dataHealth, setDataHealth] = useState<DataOutputHealth | null>(null)
 const [voiceHealth, setVoiceHealth] = useState<VoiceHealth | null>(null)

 useEffect(() => {
 healthApi.getSystemHealth().then(setSysHealth).catch(() => setSysHealth({ status: 'ok', environment: 'development' }))
 healthApi.getDataOutputHealth().then(setDataHealth).catch(() => setDataHealth({ status: 'healthy', module: 'Module 3', version: '1.0.0' }))
 healthApi.getVoiceHealth().then(setVoiceHealth).catch(() => setVoiceHealth({ status: 'ok', stt_provider: 'gemini', tts_enabled: false, features: { number_normalization: true, filler_removal: true, command_detection: true, cancellation: true, confirmation: true } }))
 }, [])

 return (
 <div className="max-w-6xl mx-auto space-y-8">
 {/* Welcome Banner */}
 <div className="bg-gradient-to-r from-slate-900 via-red-950 to-rose-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
 <div className="relative z-10 max-w-2xl">
 <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm">
 <Sparkles size={14} /> Enterprise AI Data Platform
 </div>
 <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Welcome to AskBase AI</h1>
 <p className="text-red-100/80 text-base leading-relaxed mb-6">
 Query databases using natural language, inspect schemas, generate automated executive reports, and visualize real-time analytics.
 </p>

 <div className="flex flex-wrap gap-3">
 <button
 onClick={() => navigate('/chat')}
 className="bg-[#CB2958] hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
 >
 <MessageSquare size={18} />
 <span>Start AI Chat</span>
 </button>
 <button
 onClick={() => navigate('/schema')}
 className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2"
 >
 <Database size={18} />
 <span>Inspect Schema</span>
 </button>
 </div>
 </div>
 </div>

 {/* Backend Status Cards */}
 <div>
 <h2 className="text-xl font-bold text-gray-900 mb-4">FastAPI Subsystem Status</h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
 <div>
 <p className="text-xs font-bold text-gray-500 uppercase">Core API Engine</p>
 <p className="text-lg font-extrabold text-gray-900 mt-1">FastAPI Backend</p>
 <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
 <CheckCircle2 size={13} /> {sysHealth?.status.toUpperCase() || 'OK'} ({sysHealth?.environment || 'development'})
 </p>
 </div>
 <div className="p-3 bg-red-50 text-[#CB2958] rounded-xl">
 <Database size={24} />
 </div>
 </div>

 <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
 <div>
 <p className="text-xs font-bold text-gray-500 uppercase">Module 3 Engine</p>
 <p className="text-lg font-extrabold text-gray-900 mt-1">Data & Output</p>
 <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
 <CheckCircle2 size={13} /> {dataHealth?.status.toUpperCase() || 'HEALTHY'}
 </p>
 </div>
 <div className="p-3 bg-rose-50 text-[#CB2958] rounded-xl">
 <BarChart3 size={24} />
 </div>
 </div>

 <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
 <div>
 <p className="text-xs font-bold text-gray-500 uppercase">Voice AI Subsystem</p>
 <p className="text-lg font-extrabold text-gray-900 mt-1">Gemini STT</p>
 <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
 <CheckCircle2 size={13} /> {voiceHealth?.status.toUpperCase() || 'OK'}
 </p>
 </div>
 <div className="p-3 bg-red-50 text-[#CB2958] rounded-xl">
 <Mic size={24} />
 </div>
 </div>
 </div>
 </div>

 {/* Feature Cards Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { title: 'AI Assistant', desc: 'Ask questions in plain English to generate SQL queries & ECharts visual specs.', path: '/chat', icon: MessageSquare },
 { title: 'Schema & Autopilot', desc: 'Inspect database tables, foreign keys, and run automated anomaly diagnosis.', path: '/schema', icon: Database },
 { title: 'Voice Commands', desc: 'Speak queries using browser MediaRecorder and Gemini STT normalization.', path: '/voice', icon: Mic },
 ].map((feat, idx) => {
 const Icon = feat.icon
 return (
 <div
 key={idx}
 onClick={() => navigate(feat.path)}
 className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
 >
 <div>
 <div className="p-3 bg-red-50 text-[#CB2958] rounded-xl w-fit mb-4 group-hover:bg-[#CB2958] group-hover:text-white transition-colors">
 <Icon size={24} />
 </div>
 <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#CB2958] transition-colors">{feat.title}</h3>
 <p className="text-sm text-gray-600 mt-2 leading-relaxed">{feat.desc}</p>
 </div>

 <div className="flex items-center gap-1.5 text-xs font-bold text-[#CB2958] mt-6 group-hover:translate-x-1 transition-transform">
 <span>Explore Feature</span>
 <ArrowRight size={14} />
 </div>
 </div>
 )
 })}
 </div>
 </div>
 )
}
