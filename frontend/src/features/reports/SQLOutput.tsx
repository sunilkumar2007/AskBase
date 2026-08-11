import React from 'react';
import { SQLViewer } from "@/components/data/SQLViewer";
import {
  Copy,
  Play,
  ShieldCheck,
  HelpCircle,
  Code2
} from 'lucide-react';
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SQLOutputProps {
  sql: string;
  title?: string;
}

export function SQLOutput({ sql, title = "Generated SQL" }: SQLOutputProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    toast.success("SQL copied to clipboard");
  };

  const handleExplain = () => {
    toast.info("Analyzing query structure...");
  };

  return (
    <div className="flex flex-col bg-[#0D0D0D]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center bg-white/5 text-white/40">
            <Code2 size={14} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 text-green-500 rounded-sm">
            <ShieldCheck size={10} />
            <span className="text-[8px] font-black tracking-widest uppercase">✓ READ ONLY</span>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-white/40 hover:text-white transition-colors"
                >
                  <Copy size={12} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-black border-none text-[9px] font-bold">Copy SQL</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleExplain}
                  className="p-1.5 text-white/40 hover:text-white transition-colors"
                >
                  <HelpCircle size={12} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-black border-none text-[9px] font-bold">Explain Query</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="p-0">
        <SQLViewer sql={sql} />
      </div>

      <div className="p-3 border-t border-white/10 flex justify-end">
        <button
          onClick={handleExplain}
          className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2"
        >
          <Play size={10} />
          Explain Execution Plan
        </button>
      </div>
    </div>
  );
}
