import React, { useState } from 'react';
import {
  MessageSquare,
  Database,
  FileText,
  Users,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  ChevronRight,
  RefreshCw,
  Trash2,
  Mail,
  UserPlus,
  ArrowUpRight,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectStore } from '@/stores/useProjectStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const mockSources = [
    { id: 's1', name: 'Production Sales DB', type: 'PostgreSQL', status: 'Connected', updated: '10m ago' },
    { id: 's2', name: 'Q3 Forecast.xlsx', type: 'File', status: 'Active', updated: '2h ago' },
    { id: 's3', name: 'Segment API', type: 'URL', status: 'Idle', updated: '1d ago' }
  ];

  const mockMembers = [
    { id: 'm1', name: 'Alex Rivera', email: 'alex@askbase.ai', role: 'Owner', avatar: 'A' },
    { id: 'm2', name: 'Sarah Chen', email: 'sarah@askbase.ai', role: 'Editor', avatar: 'S' },
    { id: 'm3', name: 'Michael Ross', email: 'michael@askbase.ai', role: 'Viewer', avatar: 'M' }
  ];

  const handleInvite = () => {
    toast.success("Invitation sent to user.");
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="h-24 border-b border-[#E4E4E7] flex items-center justify-between px-12 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 border-2 border-[#111111] flex items-center justify-center text-[#111111]">
            <Database size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#A1A1AA] mb-1">
              <span>Project</span>
              <ChevronRight size={10} />
              <span className="text-[#CB2958]">Q4 SALES ANALYSIS</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#111111]">Sales Production Intelligence</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-none border-2 h-10 text-[9px] font-black uppercase tracking-widest">
            <UserPlus size={14} className="mr-2" />
            Invite
          </Button>
          <Button className="rounded-none bg-[#111111] hover:bg-[#CB2958] text-white px-6 h-10 text-[9px] font-black uppercase tracking-widest transition-all">
            <Plus size={14} className="mr-2" />
            New Chat
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-12 pt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-[#E4E4E7] w-full justify-start rounded-none">
              {['Overview', 'Chats', 'Sources', 'Reports', 'Members'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="rounded-none border-b-2 border-transparent px-0 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA] data-[state=active]:border-[#CB2958] data-[state=active]:text-[#111111] bg-transparent"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 overflow-y-auto py-10 no-scrollbar" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <TabsContent value="overview" className="mt-0 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <section className="p-8 border border-[#E4E4E7] bg-[#FAFAFA] space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]">Project Summary</h3>
                      <p className="text-[#71717A] text-sm leading-relaxed">
                        Focused intelligence pipeline for Q4 sales metrics. Connected to production warehouse and legacy ERP data.
                        Tracking revenue velocity, deal stages, and representative performance across three regions.
                      </p>
                    </section>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Intelligence Level', value: 'Neural V2', icon: Shield },
                        { label: 'Data Latency', value: '142ms', icon: RefreshCw },
                        { label: 'Security Context', value: 'Isolated', icon: Settings }
                      ].map((card, i) => (
                        <div key={i} className="p-6 border border-[#E4E4E7] space-y-4">
                          <card.icon size={16} className="text-[#CB2958]" />
                          <div>
                            <p className="text-[8px] font-black text-[#A1A1AA] uppercase tracking-widest">{card.label}</p>
                            <p className="text-xs font-black text-[#111111] uppercase tracking-widest mt-1">{card.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]">Recent Activity</h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="w-[2px] bg-[#E4E4E7] group-hover:bg-[#CB2958] transition-colors" />
                          <div>
                            <p className="text-[9px] font-black text-[#111111] uppercase tracking-widest">Report Generated</p>
                            <p className="text-[9px] font-bold text-[#A1A1AA] uppercase mt-1">14:02 · Sarah Chen</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sources" className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  {mockSources.map((source) => (
                    <div key={source.id} className="p-6 border border-[#E4E4E7] flex items-center justify-between group hover:border-[#111111] transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#FAFAFA] text-[#71717A] group-hover:text-[#CB2958] transition-colors">
                          <Database size={18} />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#111111] mb-1">{source.name}</h4>
                          <div className="flex items-center gap-3 text-[9px] font-bold text-[#A1A1AA] uppercase tracking-widest">
                            <span>{source.type}</span>
                            <span className="w-1 h-1 rounded-full bg-[#E4E4E7]" />
                            <span>Updated {source.updated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <div className={cn("w-1.5 h-1.5 rounded-full", source.status === 'Connected' ? 'bg-green-500' : 'bg-amber-500')} />
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#111111]">{source.status}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-[#A1A1AA] hover:text-[#111111]"><RefreshCw size={14} /></button>
                           <button className="p-2 text-[#A1A1AA] hover:text-[#111111]"><Settings size={14} /></button>
                           <button className="p-2 text-[#A1A1AA] hover:text-[#CB2958]"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="p-8 border-2 border-dashed border-[#E4E4E7] flex items-center justify-center gap-3 hover:border-[#CB2958] hover:bg-[#CB2958]/5 transition-all text-[#A1A1AA] hover:text-[#CB2958]">
                    <Plus size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Add Data Source</span>
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="p-6 border border-[#E4E4E7] flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-black">
                          {member.avatar}
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#111111] mb-1">{member.name}</h4>
                          <p className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-widest">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="px-3 py-1 bg-[#FAFAFA] border border-[#E4E4E7] text-[8px] font-black uppercase tracking-widest text-[#71717A]">
                          {member.role}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-[#A1A1AA] hover:text-[#111111]"><Mail size={14} /></button>
                           <button className="p-2 text-[#A1A1AA] hover:text-[#CB2958]"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
