import { Bell, Search, User, Database } from 'lucide-react'
import { useCompany } from '../../stores/useCompany'

export default function Header() {
  const { company } = useCompany()

  return (
    <header className="bg-white border-b border-[#DDDDDD] px-6 py-3.5 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          {/* Header Clean Typography Logo */}
          <div className="flex items-center gap-1.5 pr-4 border-r border-[#DDDDDD]">
            <Database size={18} className="text-[#CB2958]" />
            <span className="text-base font-black text-[#CB2958]">Ask</span>
            <span className="text-base font-black text-[#1D242E]">Base</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type="text"
              placeholder="Search tables, queries, dashboards, reports..."
              className="pl-10 pr-4 py-2 border border-[#DDDDDD] rounded-xl w-96 text-sm text-[#1D242E] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#CB2958] bg-[#FAFAFA]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-[#EEEEEE] px-3 py-1.5 rounded-xl border border-[#DDDDDD] text-xs">
            <span className="font-bold text-[#1D242E]">{company.name}</span>
            <span className="text-[#CB2958] font-extrabold">• {company.currency}</span>
          </div>

          <button className="relative p-2 text-[#6B7280] hover:text-[#1D242E] rounded-xl hover:bg-[#EEEEEE] transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#CB2958] rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#DDDDDD]">
            <div className="w-8 h-8 bg-[#CB2958] rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
              <User size={16} />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1D242E] block leading-none">Enterprise Admin</span>
              <span className="text-[10px] text-[#6B7280] block mt-0.5 font-mono">AskBase User</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
