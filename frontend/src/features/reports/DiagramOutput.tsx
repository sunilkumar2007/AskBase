import React from 'react';
import { MermaidRenderer } from "@/components/diagrams/MermaidRenderer";
import {
  Maximize2,
  RotateCcw,
  Copy,
  Download,
  Workflow,
  Search
} from 'lucide-react';
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DiagramOutputProps {
  chart: string;
  type?: 'ER' | 'Flow' | 'Tree';
  title?: string;
}

export function DiagramOutput({ chart, type = 'Flow', title = "System Architecture" }: DiagramOutputProps) {
  const handleCopy = () => {
    toast.success("Mermaid code copied");
  };

  const handleReset = () => {
    toast.info("Resetting view...");
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-[#E4E4E7] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#CB2958]/5 text-[#CB2958]">
            <Workflow size={16} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]">{title}</h4>
            <span className="text-[8px] font-bold text-[#A1A1AA] uppercase tracking-widest">{type} DIAGRAM</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleReset} className="p-2 text-[#71717A] hover:text-[#111111] transition-colors">
                <RotateCcw size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Reset Zoom</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleCopy} className="p-2 text-[#71717A] hover:text-[#111111] transition-colors">
                <Copy size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy Code</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="p-8 bg-[#FAFAFA] min-h-[300px] flex items-center justify-center relative overflow-hidden group">
        <MermaidRenderer chart={chart} />

        <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 flex items-center justify-center bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#111111] shadow-sm">
            <Search size={12} />
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-[#E4E4E7] flex justify-end gap-2 bg-white">
        <button className="text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#111111] px-4 py-2 border border-[#E4E4E7] transition-all">
          Fullscreen
        </button>
        <button className="text-[9px] font-black uppercase tracking-widest text-white bg-[#111111] hover:bg-[#CB2958] px-4 py-2 transition-all">
          Export Image
        </button>
      </div>
    </div>
  );
}
