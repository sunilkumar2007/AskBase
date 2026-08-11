import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Share2,
  Maximize2,
  Star,
  Trash2,
  FileText,
  BarChart3,
  Table as TableIcon,
  Code2,
  Lightbulb,
  Workflow
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useReportStore, ReportItem } from '@/stores/useReportStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Import sub-components (we'll create these next)
import { ChartOutput } from './ChartOutput';
import { TableOutput } from './TableOutput';
import { SQLOutput } from './SQLOutput';
import { InsightOutput } from './InsightOutput';
import { DiagramOutput } from './DiagramOutput';

export function ReportPanel() {
  const { items, removeItem, clearReport } = useReportStore();
  const showReportPanel = useSettingsStore((state) => state.showReportPanel);
  const toggleReportPanel = useSettingsStore((state) => state.toggleReportPanel);

  const handleSave = () => {
    toast.success("Report saved.");
  };

  const handleExport = (format: string) => {
    toast.info(`Preparing ${format} export...`);
    setTimeout(() => {
      toast.success(`${format} export ready.`);
    }, 1500);
  };

  if (!showReportPanel) return null;

  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-[420px] bg-white border-l border-[#E4E4E7] z-40 flex flex-col shadow-2xl"
    >
      <header className="h-20 border-b border-[#E4E4E7] px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#CB2958]/5 text-[#CB2958]">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]">Report Workspace</h3>
            <p className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-0.5">{items.length} Artifacts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSave}
                className="p-2 text-[#71717A] hover:text-[#CB2958] transition-colors"
              >
                <Star size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Favorite Report</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleReportPanel}
                className="p-2 text-[#71717A] hover:text-[#111111] transition-colors"
              >
                <X size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Close Panel</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
            <div className="w-16 h-16 border-2 border-[#E4E4E7] mb-6 flex items-center justify-center">
              <FileText size={24} className="text-[#A1A1AA]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]">Empty Workspace</p>
            <p className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-2">Generated outputs will appear here</p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-8 space-y-12 pb-24">
              {items.map((item, index) => (
                <div key={item.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-[#CB2958]/30">0{index + 1}</span>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]">{item.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#A1A1AA] hover:text-[#111111] transition-colors">
                        <Maximize2 size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[#A1A1AA] hover:text-[#CB2958] transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E4E4E7] shadow-sm overflow-hidden">
                    {item.type === 'chart' && <ChartOutput {...item.content} />}
                    {item.type === 'table' && <TableOutput {...item.content} />}
                    {item.type === 'sql' && <SQLOutput {...item.content} />}
                    {item.type === 'insight' && <InsightOutput {...item.content} />}
                    {item.type === 'diagram' && <DiagramOutput {...item.content} />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <footer className="p-8 border-t border-[#E4E4E7] bg-white sticky bottom-0">
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 rounded-none border-2 h-12 text-[10px] font-black uppercase tracking-widest"
            onClick={() => handleExport('PDF')}
          >
            <Download size={14} className="mr-2" />
            Export PDF
          </Button>
          <Button
            className="flex-1 rounded-none bg-[#111111] hover:bg-[#CB2958] text-white h-12 text-[10px] font-black uppercase tracking-widest transition-all"
            onClick={handleSave}
          >
            Save Report
          </Button>
        </div>
      </footer>
    </motion.aside>
  );
}
