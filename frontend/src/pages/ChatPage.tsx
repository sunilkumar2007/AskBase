import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SmartChatInput } from "@/components/ai/SmartChatInput";
import { IntelligenceCoreSmall } from "@/components/ai/IntelligenceCoreSmall";
import { mockQueryResult, mockSQL } from "@/lib/mock-data";
import {
  Database,
  ChevronRight,
  Loader2,
  Share2,
  FileText,
  Clock,
  Zap,
  ShieldCheck,
  Star,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useChatStore } from '@/stores/useChatStore';
import { useReportStore } from '@/stores/useReportStore';
import { InsightCard } from "@/components/chat/InsightCard";
import { ChartRenderer } from "@/components/charts/ChartRenderer";
import { SQLViewer } from "@/components/data/SQLViewer";
import { DataTable } from "@/components/data/DataTable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import VoiceMode from "@/components/ai/VoiceMode";

export default function ChatPage() {
  const { messages, addMessage, isProcessing, setProcessing } = useChatStore();
  const addItem = useReportStore((state) => state.addItem);
  const showReportPanel = useSettingsStore((state) => state.showReportPanel);
  const toggleReportPanel = useSettingsStore((state) => state.toggleReportPanel);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string, chips: string[]) => {
    setProcessing(true);

    addMessage({
      role: 'user',
      content: text,
      chips
    });

    // Simulate multi-step processing
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: "Understanding objective...",
        type: 'status',
        steps: [
          { name: 'PARSING INTENT', status: 'complete' },
          { name: 'SCHEMA RESOLUTION', status: 'processing' },
          { name: 'SQL SYNTHESIS', status: 'pending' },
          { name: 'DATA EXECUTION', status: 'pending' }
        ]
      });

      setTimeout(() => {
        setProcessing(false);
        // Replace last status message with result
        // For simplicity in this mock, we just add the result
        const resultInsight = "Electronics segment revenue grew by 18% YoY, primarily driven by premium tier laptops (+24%) and mobile accessories (+12%).";

        addMessage({
          role: 'assistant',
          content: "Analysis complete. I've synthesized the electronics segment performance data.",
          type: 'result',
          sql: mockSQL,
          data: mockQueryResult,
          insight: {
            what: resultInsight,
            why: "Average order value increased faster than order volume, indicating strong demand for high-end SKUs.",
            nextQuestion: "Compare this with last quarter."
          }
        });

        // Add items to report panel automatically
        addItem({
          id: `chart-${Date.now()}`,
          type: 'chart',
          title: 'Electronics Performance',
          content: {
            type: 'bar',
            data: mockQueryResult,
            xKey: 'name',
            yKey: 'sales',
            title: 'Revenue Trend',
            description: 'Year-over-year revenue comparison by product category.'
          }
        });

        addItem({
          id: `insight-${Date.now()}`,
          type: 'insight',
          title: 'Strategic Analysis',
          content: {
            what: resultInsight,
            why: "Average order value increased faster than order volume, indicating strong demand for high-end SKUs.",
            nextQuestion: "Compare this with last quarter."
          }
        });

        if (!showReportPanel) toggleReportPanel();
      }, 2500);
    }, 800);
  };

  const [isVoiceOpen, setIsVoiceOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-full bg-background relative">
      <VoiceMode isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
      <header className="h-16 border-b border-border flex items-center justify-between px-8 shrink-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Live_Analytics_V2</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">PostgreSQL • 12.4 GB</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Tooltip>
             <TooltipTrigger asChild>
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted">
                  <Star size={18} />
                </button>
             </TooltipTrigger>
             <TooltipContent>Favorite Chat</TooltipContent>
           </Tooltip>

           <Tooltip>
             <TooltipTrigger asChild>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 size={18} className="rounded-full hover:bg-muted" />
                </button>
             </TooltipTrigger>
             <TooltipContent>Share Analysis</TooltipContent>
           </Tooltip>

           <Tooltip>
             <TooltipTrigger asChild>
               <button
                 onClick={toggleReportPanel}
                 className={cn(
                    "p-2 rounded-xl transition-all border",
                    showReportPanel ? "bg-foreground text-background border-foreground" : "text-muted-foreground border-border hover:bg-muted"
                 )}
               >
                 <FileText size={18} />
               </button>
             </TooltipTrigger>
             <TooltipContent>{showReportPanel ? 'Close Report' : 'Open Report'}</TooltipContent>
           </Tooltip>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-12 no-scrollbar scroll-smooth bg-background">
        <div className="max-w-4xl mx-auto space-y-16 pb-32">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-8",
                msg.role === 'user' ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-12 h-12 flex items-center justify-center shrink-0 border-2 transition-all rounded-[18px]",
                msg.role === 'user'
                  ? "bg-foreground border-foreground text-background"
                  : "bg-card border-border text-primary"
              )}>
                {msg.role === 'user' ? (
                  <span className="text-[10px] font-black">USR</span>
                ) : (
                  <IntelligenceCoreSmall isProcessing={msg.type === 'status'} />
                )}
              </div>

              <div className={cn(
                "flex-1 space-y-4",
                msg.role === 'user' ? "text-right" : ""
              )}>
                <div className="flex items-center gap-4 mb-2 opacity-30">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">
                    {msg.role === 'user' ? 'REQUESTOR' : 'ASKBASE_CORE'}
                  </span>
                  <span className="text-[9px] font-medium text-muted-foreground">{msg.timestamp}</span>
                </div>

                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-end">
                    {msg.chips.map((chip: string) => (
                      <span key={chip} className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20 rounded-full">
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                <div className={cn(
                  "text-xl font-medium tracking-tight text-foreground leading-relaxed max-w-[90%]",
                  msg.role === 'user' ? "ml-auto" : ""
                )}>
                  {msg.content}
                </div>

                {msg.type === 'status' && (
                  <div className="grid grid-cols-1 gap-1 max-w-sm mt-8 border-l border-border pl-6">
                    {msg.steps?.map((step: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2 transition-all opacity-60">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{step.name}</span>
                        {step.status === 'complete' ? (
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        ) : step.status === 'processing' ? (
                          <Loader2 size={12} className="text-primary animate-spin" />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-border rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {msg.type === 'result' && (
                  <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InsightCard
                        title="Semantic Insight"
                        content={msg.insight?.what}
                        metric="+18.4%"
                        trend="up"
                      />
                      <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm group relative h-[300px] overflow-hidden">
                         <ChartRenderer type="bar" xKey="name" yKey="sales" data={msg.data || []} title="Revenue Trend" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between opacity-60">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground">Generated Query</h4>
                        <div className="flex items-center gap-4">
                           <span className="text-[9px] font-bold text-muted-foreground">✓ READ ONLY</span>
                           <span className="text-[9px] font-bold text-muted-foreground">EXEC_TIME: 142MS</span>
                        </div>
                      </div>
                      <SQLViewer sql={msg.sql || ''} />
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground opacity-60">Result Set</h4>
                      <div className="border border-border rounded-[24px] overflow-hidden bg-card">
                        <DataTable data={msg.data || []} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-8 border-t border-border bg-background z-20">
        <div className="max-w-4xl mx-auto">
          <SmartChatInput onSend={handleSend} isProcessing={isProcessing} onVoiceTrigger={() => setIsVoiceOpen(true)} />
        </div>
      </footer>
    </div>
  );
}
